package com.bitehub.controller;

import com.bitehub.service.OrderEventService;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Liveness / readiness probe for uptime monitors and the local watchdog.
 * Returns 200 with {@code status=UP} when the DB answers, 503 with
 * {@code status=DEGRADED} otherwise. Never touches the network externally.
 */
@RestController
@RequestMapping("/api/health")
public class HealthController {

    private final JdbcTemplate jdbcTemplate;
    private final OrderEventService orderEventService;

    public HealthController(JdbcTemplate jdbcTemplate, OrderEventService orderEventService) {
        this.jdbcTemplate = jdbcTemplate;
        this.orderEventService = orderEventService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> body = new LinkedHashMap<>();
        boolean dbUp;
        try {
            Integer one = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            dbUp = one != null && one == 1;
        } catch (Exception ex) {
            dbUp = false;
        }
        body.put("status", dbUp ? "UP" : "DEGRADED");
        body.put("db", dbUp ? "UP" : "DOWN");
        body.put("sseClients", orderEventService.subscriberCount());
        body.put("time", LocalDateTime.now().toString());
        if (!dbUp) {
            return ResponseEntity.status(503).body(body);
        }
        return ResponseEntity.ok(body);
    }
}
