package com.bitehub.repository;

import com.bitehub.model.MenuItem;
import com.bitehub.model.Restaurant;
import com.bitehub.model.Role;
import com.bitehub.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.TestPropertySource;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@TestPropertySource(properties = {"jwt.secret=test-secret", "admin.secret=test-secret"})
class RestaurantRepositoryTest {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private TestEntityManager entityManager;

    @BeforeEach
    void setUp() {
        User owner = entityManager.persist(new User("Asian Owner", "asian@example.test", "password", null,
                Role.ROLE_RESTAURANT));
        Restaurant asianRestaurant = createRestaurant(owner, "Noodle House", "Asian", true);
        entityManager.persist(asianRestaurant);

        MenuItem noodles = new MenuItem();
        noodles.setRestaurant(asianRestaurant);
        noodles.setName("Spicy Noodles");
        noodles.setDescription("Rice noodles with chili");
        noodles.setCategory("Noodles");
        noodles.setPrice(12.0);
        entityManager.persist(noodles);

        User unverifiedOwner = entityManager.persist(new User("New Owner", "new@example.test", "password", null,
                Role.ROLE_RESTAURANT));
        Restaurant unverifiedRestaurant = createRestaurant(unverifiedOwner, "New Noodle Shop", "Asian", false);
        entityManager.persist(unverifiedRestaurant);

        MenuItem unverifiedNoodles = new MenuItem();
        unverifiedNoodles.setRestaurant(unverifiedRestaurant);
        unverifiedNoodles.setName("Spicy Noodles");
        unverifiedNoodles.setCategory("Noodles");
        unverifiedNoodles.setPrice(10.0);
        entityManager.persist(unverifiedNoodles);

        entityManager.flush();
        entityManager.clear();
    }

    @Test
    void searchesMenuItemsAndCombinesCuisineFilter() {
        List<Restaurant> matches = restaurantRepository.searchVerifiedRestaurants("SPICY noodles", "Asian");

        assertThat(matches).extracting(Restaurant::getName).containsExactly("Noodle House");
        assertThat(restaurantRepository.searchVerifiedRestaurants("noodles", "Italian")).isEmpty();
    }

    @Test
    void searchesMenuCategoriesAndAllowsCuisineOnlyFilter() {
        assertThat(restaurantRepository.searchVerifiedRestaurants("Noodles", null))
                .extracting(Restaurant::getName)
                .containsExactly("Noodle House");
        assertThat(restaurantRepository.searchVerifiedRestaurants(null, "Asian"))
                .extracting(Restaurant::getName)
                .containsExactly("Noodle House");
    }

    private Restaurant createRestaurant(User owner, String name, String cuisine, boolean verified) {
        Restaurant restaurant = new Restaurant();
        restaurant.setUser(owner);
        restaurant.setName(name);
        restaurant.setCuisineType(cuisine);
        restaurant.setDescription(name + " description");
        restaurant.setAddress("Campus");
        restaurant.setVerified(verified);
        return restaurant;
    }
}
