
<template>
    <div class="logs">
        <div class="logs__header">
            <div>
                <div class="back_button" @click="$router.back()">← Powrót</div>
                <h2>Logi systemowe</h2>
            </div>
            <div class="logs__controls">
                <label class="toggle">
                    <input type="checkbox" v-model="autoRefresh" />
                    <span>Auto odświeżanie</span>
                </label>
                <button class="btn" @click="fetchLogs" :disabled="loading">Odśwież</button>
        </div>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-else-if="loading" class="loading">Wczytywanie logów…</p>

    <ul v-else class="log-list">
        <li v-for="(log, index) in logs" :key="index" class="log-item">
            <div class="log-row">
                <span class="badge" :class="badgeClass(log.level)">{{ log.level }}</span>
                <span class="log-message">{{ log.message }}</span>
            </div>
            <div class="log-meta">
                <span class="time">{{ formatTime(log.time) }}</span>
                <span class="sep">•</span>
                <span class="location">{{ log.module }}.{{ log.funcName }}:{{ log.line }}</span>
                <span class="sep">•</span>
                <span class="logger">{{ log.logger }}</span>
            </div>
            <pre v-if="log.exception" class="exception">{{ log.exception }}</pre>
        </li>
        <li v-if="logs.length === 0" class="log-empty">Brak logów do wyświetlenia.</li>
    </ul>
    </div>

</template>

<script>
import { API_URL } from '../variables'

export default {
    data() {
        return {
            logs: [],
            loading: false,
            error: '',
            autoRefresh: true,
            intervalId: null,
            refreshMs: 2000,
        }
    },
    methods: {
        async fetchLogs() {
            this.loading = this.logs.length === 0; // show loader only on first load
            this.error = ''
            try {
                const response = await fetch("http://" + API_URL + '/logs');
                if (!response.ok) throw new Error(`Błąd pobierania: ${response.status}`)
                const data = await response.json();
                this.logs = Array.isArray(data?.logs) ? data.logs : [];
                // sort by time descending
                this.logs.sort((a, b) => new Date(b.time) - new Date(a.time));
            } catch (err) {
                this.error = (err && err.message) ? err.message : 'Nie udało się pobrać logów.'
            } finally {
                this.loading = false
            }
        },
        formatTime(iso) {
            if (!iso || typeof iso !== 'string') return ''
            // Bezpieczne formatowanie: 2025-10-04T11:22:28.459569 -> 2025-10-04 11:22:28
            const clean = iso.replace('T', ' ')
            return clean.slice(0, 19)
        },
        badgeClass(level) {
            const lv = (level || '').toUpperCase()
            return {
                'badge--error': lv === 'ERROR' || lv === 'CRITICAL' || lv === 'FATAL',
                'badge--warn': lv === 'WARN' || lv === 'WARNING',
                'badge--info': lv === 'INFO',
                'badge--debug': lv === 'DEBUG'
            }
        }
    },
    watch: {
        autoRefresh(newVal) {
            if (newVal) {
                this.intervalId = setInterval(this.fetchLogs, this.refreshMs)
            } else if (this.intervalId) {
                clearInterval(this.intervalId)
                this.intervalId = null
            }
        }
    },
    mounted() {
        this.fetchLogs();
        if (this.autoRefresh) {
            this.intervalId = setInterval(this.fetchLogs, this.refreshMs)
        }
    },
    beforeUnmount() {
        if (this.intervalId) clearInterval(this.intervalId)
    }
}
</script>

<style scoped>
.back_button {
    cursor: pointer;
    margin-bottom: 6px;
    font-size: 14px;
}

.logs {
    background: var(--color-background-soft);
    border: 1px solid var(--color-border);
    border-radius: 10px;
    padding: 12px;
}

.logs__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
}

.logs__controls {
    display: flex;
    gap: 8px;
    align-items: center;
}

.toggle {
    display: inline-flex;
    gap: 6px;
    align-items: center;
    color: var(--color-text);
}

.btn {
    background: var(--blue);
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 6px 10px;
    cursor: pointer;
}
.btn:disabled {
    opacity: 0.6;
    cursor: default;
}

.loading,
.error,
.log-empty {
    text-align: center;
    color: var(--vt-c-text-dark-2);
}
.error { color: var(--red); }

.log-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.log-item {
    padding: 10px 8px;
    border-top: 1px solid var(--color-border);
}
.log-item:first-child {
    border-top: none;
}

.log-row {
    display: flex;
    align-items: center;
    gap: 8px;
}

.log-message {
    color: var(--color-text);
    font-weight: 500;
}

.log-meta {
    margin-top: 2px;
    color: var(--vt-c-text-dark-2);
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
}
.sep { opacity: 0.6; }

.badge {
    display: inline-block;
    border-radius: 999px;
    padding: 2px 8px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.3px;
    color: #fff;
}
.badge--error { background: var(--red); }
.badge--warn { background: var(--orange); }
.badge--info { background: var(--blue); }
.badge--debug { background: #666; }

.exception {
    margin-top: 6px;
    padding: 8px;
    background: rgba(212, 89, 81, 0.12);
    border-left: 3px solid var(--red);
    border-radius: 6px;
    white-space: pre-wrap;
    color: var(--color-text);
}
</style>
