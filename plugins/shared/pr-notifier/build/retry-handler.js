/**
 * Smart retry handler with exponential backoff
 */
export class RetryHandler {
    options;
    consecutiveFailures = 0;
    constructor(options = {
        maxRetries: 5,
        baseDelay: 1000, // 1 second
        maxDelay: 60000, // 1 minute
        backoffMultiplier: 2,
    }) {
        this.options = options;
    }
    /**
     * Execute function with retry logic
     */
    async execute(fn, context) {
        let lastError = null;
        for (let attempt = 0; attempt <= this.options.maxRetries; attempt++) {
            try {
                const result = await fn();
                this.consecutiveFailures = 0; // Reset on success
                return result;
            }
            catch (error) {
                lastError = error instanceof Error ? error : new Error(String(error));
                this.consecutiveFailures++;
                // Don't retry on last attempt
                if (attempt === this.options.maxRetries) {
                    break;
                }
                const delay = this.calculateDelay(attempt);
                console.warn(`⚠️  ${context} failed (attempt ${attempt + 1}/${this.options.maxRetries + 1}). Retrying in ${delay}ms...`);
                console.warn(`   Error: ${lastError.message}`);
                await this.sleep(delay);
            }
        }
        throw new Error(`${context} failed after ${this.options.maxRetries + 1} attempts: ${lastError?.message}`);
    }
    /**
     * Calculate delay with exponential backoff
     */
    calculateDelay(attempt) {
        const delay = this.options.baseDelay * Math.pow(this.options.backoffMultiplier, attempt);
        return Math.min(delay, this.options.maxDelay);
    }
    /**
     * Get current health status
     */
    getHealthStatus() {
        if (this.consecutiveFailures === 0)
            return "healthy";
        if (this.consecutiveFailures <= 2)
            return "degraded";
        return "unhealthy";
    }
    /**
     * Get failure count
     */
    getFailureCount() {
        return this.consecutiveFailures;
    }
    /**
     * Reset failure counter
     */
    reset() {
        this.consecutiveFailures = 0;
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
