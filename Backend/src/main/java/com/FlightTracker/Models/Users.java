package com.FlightTracker.Models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "users")
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false)
    private String email;
    private String username;
    private String password;
    private String googleID;

    public Users(long id, String email, String username, String password, String googleID) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.password = password;
        this.googleID = googleID;
    }

    @Override
    public String toString() {
        return "Users{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", googleID='" + googleID + '\'' +
                '}';
    }
}
