package com.github.escom.escomvoting.service;

import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * Sends transactional email (currently the welcome message with a temporary password).
 *
 * Sends are {@link Async} and never throw: a failed delivery is logged but never rolls
 * back the surrounding user-creation transaction, so an SMTP outage cannot block the
 * admin from importing a roster. Toggle off with {@code app.mail.enabled=false}.
 */
@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final boolean enabled;
    private final String from;
    private final String frontendUrl;

    public EmailService(JavaMailSender mailSender,
                        @Value("${app.mail.enabled:true}") boolean enabled,
                        @Value("${app.mail.from:escomvoting@gmail.com}") String from,
                        @Value("${app.frontend.url:http://localhost:44100}") String frontendUrl) {
        this.mailSender = mailSender;
        this.enabled = enabled;
        this.from = from;
        this.frontendUrl = frontendUrl;
    }

    @Async
    public void sendWelcomeEmail(String toEmail, String name, String temporaryPassword) {
        if (!enabled) {
            log.info("Mail disabled (app.mail.enabled=false) — skipping welcome email to {}", toEmail);
            return;
        }
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
            helper.setFrom(from);
            helper.setTo(toEmail);
            helper.setSubject("Bienvenido a ESCOMVoting");
            helper.setText(buildHtmlBody(name, toEmail, temporaryPassword), true);
            mailSender.send(message);
            log.info("Welcome email sent to {}", toEmail);
        } catch (Exception e) {
            log.warn("Failed to send welcome email to {}: {}", toEmail, e.getMessage());
        }
    }

    private String buildHtmlBody(String name, String email, String temporaryPassword) {
        String safeName = escape(name);
        return """
            <div style="font-family:Segoe UI,Arial,sans-serif;background:#f4f8fb;padding:32px">
              <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #d6ecf7;border-radius:16px;overflow:hidden">
                <div style="background:#050c9c;padding:24px 32px">
                  <h1 style="margin:0;color:#ffffff;font-size:20px;letter-spacing:-0.02em">ESCOMVoting</h1>
                </div>
                <div style="padding:32px">
                  <p style="color:#0b1f3a;font-size:15px;margin:0 0 16px">Hola <strong>%s</strong>,</p>
                  <p style="color:#33475b;font-size:14px;line-height:1.6;margin:0 0 20px">
                    Se ha creado una cuenta para ti en la plataforma de votación electrónica
                    de ESCOM. Usa las siguientes credenciales para iniciar sesión:
                  </p>
                  <div style="background:#eef6fd;border:1px solid #d6ecf7;border-radius:12px;padding:16px 20px;margin:0 0 20px">
                    <p style="margin:0 0 8px;color:#33475b;font-size:13px">Correo: <strong style="color:#0b1f3a">%s</strong></p>
                    <p style="margin:0;color:#33475b;font-size:13px">Contraseña temporal:
                      <strong style="color:#0b1f3a;font-family:monospace;font-size:15px">%s</strong>
                    </p>
                  </div>
                  <p style="color:#33475b;font-size:14px;line-height:1.6;margin:0 0 24px">
                    Por seguridad, <strong>cambia tu contraseña</strong> en cuanto inicies sesión
                    por primera vez, desde tu perfil.
                  </p>
                  <a href="%s/login"
                     style="display:inline-block;background:#050c9c;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 24px;border-radius:999px">
                    Iniciar sesión
                  </a>
                  <p style="color:#8aa0b6;font-size:12px;line-height:1.6;margin:28px 0 0">
                    Si no esperabas este correo, ignóralo. Este es un mensaje automático,
                    por favor no respondas.
                  </p>
                </div>
              </div>
            </div>
            """.formatted(safeName, escape(email), escape(temporaryPassword), frontendUrl);
    }

    private static String escape(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;");
    }
}
