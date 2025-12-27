package com.utility.auth.service;

import com.utility.auth.model.User;
import com.utility.auth.dto.response.LoginResponseDto;

public interface AuthService {

    User registerUser(User user);
    LoginResponseDto login(String username, String password);
}