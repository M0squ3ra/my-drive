package com.example.mydriveapi.service;

import com.example.mydriveapi.data.UserRepository;
import com.example.mydriveapi.domain.User;
import com.example.mydriveapi.other.RegisterUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private DocumentStorageService documentStorageService;

    @Override
    public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
        User user = userRepository.findByUserName(s);
        if (user == null) {
            throw new UsernameNotFoundException(s);
        } else {
            return user;
        }
    }

    public User findByUserName(String username){
        return userRepository.findByUserName(username);
    }

    public User save(RegisterUser registerUser)   {
        User user = new User();
        user.setUserName(registerUser.getUsername());
        user.setPassword(passwordEncoder.encode(registerUser.getPassword()));

        userRepository.save(user);

        Path userPath = Paths.get(documentStorageService.getUploadDir().toString() + "/" + registerUser.getUsername());
        try {
            Files.createDirectory(userPath);
        } catch (IOException e) {
        }

        return user;
    }
}
