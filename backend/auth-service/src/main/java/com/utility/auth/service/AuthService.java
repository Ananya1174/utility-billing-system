package com.utility.auth.service;

import com.utility.auth.model.User;

import java.util.List;

import com.utility.auth.dto.response.LoginResponseDto;
import com.utility.auth.dto.response.UserResponseDto;

public interface AuthService {

    User registerUser(User user);
    LoginResponseDto login(String username, String password);
    void forgotPassword(String email);

    void resetPassword(String token, String newPassword);
    void changePassword(String username, String oldPassword, String newPassword);

    List<UserResponseDto> getAllUsers();

    UserResponseDto getUserById(String userId);
  

    void deleteUser(String userId);
}