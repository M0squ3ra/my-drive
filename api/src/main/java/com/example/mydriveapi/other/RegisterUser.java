package com.example.mydriveapi.other;

import lombok.Data;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
public class RegisterUser {
    @NotNull(message = "Username can't be null")
    @Size(min = 4,max = 15,message = "Username lenght must be between 8 and 15")
    private String username;
    @Size(min = 8,max = 15,message = "Password lenght must be between 8 and 15")
    private String password;
}
