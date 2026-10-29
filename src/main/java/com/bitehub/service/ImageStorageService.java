package com.bitehub.service;

import com.bitehub.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

/**
 * Persists uploaded images under one canonical directory outside the build
 * tree ({@code bitehub.uploads.dir}, default {@code uploads/}), served back at
 * {@code /images/uploads/**} by {@link com.bitehub.config.MediaResourceConfig}.
 *
 * <p>Security: the image is decoded and the extension whitelisted BEFORE
 * anything is written to disk. A mislabeled non-image (spoofed content type)
 * or a disallowed extension can therefore never be stored — let alone served,
 * which previously allowed stored XSS via an uploaded .html file.
 */
@Service
public class ImageStorageService {

    private static final long MAX_BYTES = 10L * 1024 * 1024;
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png", "gif");

    private final Path uploadsDir;

    public ImageStorageService(@Value("${bitehub.uploads.dir:uploads}") String uploadsDir) {
        this.uploadsDir = Paths.get(uploadsDir).toAbsolutePath().normalize();
    }

    /**
     * Validates and stores an image.
     *
     * @return the public URL of the stored file, e.g. {@code /images/uploads/abc123_photo.jpg}
     */
    public String store(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Please select a file to upload");
        }
        if (file.getSize() > MAX_BYTES) {
            throw new BadRequestException("Image is too large (maximum 10MB)");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BadRequestException("Only image files (JPEG, PNG, GIF) are allowed");
        }

        String originalFilename = StringUtils.cleanPath(
                file.getOriginalFilename() != null ? file.getOriginalFilename() : "image.jpg");
        originalFilename = originalFilename.replaceAll("[^a-zA-Z0-9._-]", "_");
        if (!ALLOWED_EXTENSIONS.contains(extensionOf(originalFilename))) {
            throw new BadRequestException("Only JPEG, PNG, and GIF images are allowed");
        }

        // Decode before writing: junk content never reaches the served directory.
        try {
            BufferedImage image = ImageIO.read(file.getInputStream());
            if (image == null) {
                throw new BadRequestException("Invalid image content");
            }
        } catch (BadRequestException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new BadRequestException("Failed to parse image content");
        }

        String filename = UUID.randomUUID().toString().substring(0, 10) + "_" + originalFilename;
        Path target = uploadsDir.resolve(filename).normalize();
        // The sanitizer above already removes separators; this is belt and braces.
        if (!target.startsWith(uploadsDir)) {
            throw new BadRequestException("Invalid file name");
        }
        Files.createDirectories(target.getParent());
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        return "/images/uploads/" + filename;
    }

    private static String extensionOf(String filename) {
        int dot = filename.lastIndexOf('.');
        return dot >= 0 ? filename.substring(dot + 1).toLowerCase(Locale.ROOT) : "";
    }
}
