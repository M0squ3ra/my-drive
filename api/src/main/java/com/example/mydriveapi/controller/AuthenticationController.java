package com.example.mydriveapi.controller;

import com.example.mydriveapi.domain.User;
import com.example.mydriveapi.other.AuthToken;
import com.example.mydriveapi.other.LoginUser;
import com.example.mydriveapi.other.RegisterUser;
import com.example.mydriveapi.security.jwt.JwtTokenUtil;
import com.example.mydriveapi.service.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.io.UnsupportedEncodingException;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;


    @PostMapping(value = "/generate-token")
    public ResponseEntity login(@RequestBody LoginUser loginUser) throws AuthenticationException {
        UsernamePasswordAuthenticationToken userPass = new UsernamePasswordAuthenticationToken(loginUser.getUsername(),loginUser.getPassword());
        final Authentication authentication = authenticationManager.authenticate(userPass);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        final User user = userDetailsService.findByUserName(loginUser.getUsername());
        final String token = jwtTokenUtil.generateToken(user);

        return ResponseEntity.ok(new AuthToken(token));
    }

    @PostMapping(value="/signup")
    public ResponseEntity saveUser(@Valid @RequestBody RegisterUser registerUser) {

        if (userDetailsService.findByUserName(registerUser.getUsername()) != null)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User name already in use");

        User user = userDetailsService.save(registerUser);

        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }
}
