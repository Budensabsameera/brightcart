package com.ecommerce.backend.auth;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmailIgnoreCase(String email);

    long countByRole_NameIgnoreCase(String roleName);

    List<User> findByRole_NameIgnoreCaseOrderByIdDesc(String roleName);
}
