package com.bitehub.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Serves runtime uploads from a single canonical directory outside the build
 * tree ({@code bitehub.uploads.dir}, default {@code ./uploads}).
 *
 * <p>Previously uploads were mirrored into {@code target/classes/static} — a
 * rebuild wiped them and a failed mirror could leave served and stored copies
 * out of sync. This handler makes the uploads directory the one source of truth.
 * The mapping is more specific than the default static handler, so it wins.
 */
@Configuration
public class MediaResourceConfig implements WebMvcConfigurer {

    private static final Logger log = LoggerFactory.getLogger(MediaResourceConfig.class);

    private final Path uploadsDir;

    public MediaResourceConfig(@Value("${bitehub.uploads.dir:uploads}") String uploadsDir) {
        this.uploadsDir = Paths.get(uploadsDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadsDir);
        } catch (IOException ex) {
            log.warn("Could not create uploads directory '{}': {}", this.uploadsDir, ex.getMessage());
        }
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String location = uploadsDir.toUri().toString();
        if (!location.endsWith("/")) {
            location = location + "/";
        }
        registry.addResourceHandler("/images/uploads/**")
                .addResourceLocations(location);
    }
}
