/**
 * Shared wedding template engine.
 * Templates include /js/wedding-data.js which provides:
 *   jodLoadWedding() — fetch /data/wedding-demo.json
 *   jodBind()        — data-text, data-src, data-repeat, {{item.*}}
 *   jodCountdown()   — [data-count="days|hours|mins|secs"]
 * RSVP forms use class="jod-rsvp" with a sibling .jod-thanks.
 */
