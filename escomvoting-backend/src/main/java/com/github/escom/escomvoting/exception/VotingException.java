package com.github.escom.escomvoting.exception;

import org.springframework.http.HttpStatus;

public class VotingException extends RuntimeException {

    private final HttpStatus status;

    public VotingException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() { return status; }

    public static VotingException notFound(String message) {
        return new VotingException(message, HttpStatus.NOT_FOUND);
    }

    public static VotingException conflict(String message) {
        return new VotingException(message, HttpStatus.CONFLICT);
    }

    public static VotingException badRequest(String message) {
        return new VotingException(message, HttpStatus.BAD_REQUEST);
    }

    public static VotingException forbidden(String message) {
        return new VotingException(message, HttpStatus.FORBIDDEN);
    }
}
