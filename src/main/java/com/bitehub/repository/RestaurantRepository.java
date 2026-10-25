package com.bitehub.repository;

import com.bitehub.model.Restaurant;
import com.bitehub.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    Optional<Restaurant> findByUser(User user);
    Optional<Restaurant> findByUserId(Long userId);
    List<Restaurant> findByIsVerifiedTrue();
    List<Restaurant> findByIsVerifiedFalse();

    @Query("SELECT r FROM Restaurant r WHERE r.isVerified = true AND " +
           "(:query IS NULL OR " +
           "LOWER(r.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.cuisineType) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.address) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "EXISTS (SELECT m.id FROM MenuItem m WHERE m.restaurant.id = r.id AND " +
           "(LOWER(m.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(m.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(m.category) LIKE LOWER(CONCAT('%', :query, '%'))))" +
           ") AND (:cuisine IS NULL OR LOWER(r.cuisineType) = LOWER(:cuisine))")
    List<Restaurant> searchVerifiedRestaurants(@Param("query") String query, @Param("cuisine") String cuisine);
}
