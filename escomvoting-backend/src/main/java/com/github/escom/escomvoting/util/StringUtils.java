package com.github.escom.escomvoting.util;

public final class StringUtils {

    private StringUtils() {}

    /** Returns {@code s} trimmed, or an empty string if {@code s} is null. */
    public static String trimmed(String s) {
        return s == null ? "" : s.trim();
    }
}
