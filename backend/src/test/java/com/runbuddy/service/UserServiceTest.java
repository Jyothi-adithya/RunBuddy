package com.runbuddy.service;

import com.runbuddy.dto.UserDTO;
import com.runbuddy.entity.User;
import com.runbuddy.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {
    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    public void testRegisterDuplicateEmail() {
        UserDTO dto = new UserDTO();
        dto.setEmail("test@example.com");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(new User()));
        assertThrows(RuntimeException.class, () -> userService.register(dto));
    }

    @Test
    public void testRegisterSuccess() {
        UserDTO dto = new UserDTO();
        dto.setUsername("runner1");
        dto.setEmail("runner1@example.com");
        dto.setPassword("password123");

        when(userRepository.findByEmail("runner1@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password123")).thenReturn("encoded-pass");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User saved = userService.register(dto);

        assertNotNull(saved);
        assertEquals("runner1", saved.getUsername());
        assertEquals("runner1@example.com", saved.getEmail());
        assertEquals("encoded-pass", saved.getPassword());
        assertEquals("USER", saved.getRole());
        verify(userRepository).save(any(User.class));
    }
}
