<script>
import { API_URL } from '../variables'

export default {
    data() {
        return {
            images: [],
            loading: false,
            error: '',
            selectedImage: null,
            baseUrl: `http://${API_URL}`,
        }
    },
    methods: {
        async fetchImages() {
            this.loading = true
            this.error = ''
            try {
                const response = await fetch(`${this.baseUrl}/annotated-images`)
                if (!response.ok) {
                    throw new Error(`Błąd pobierania: ${response.status}`)
                }
                const data = await response.json()
                const list = Array.isArray(data?.images) ? data.images : []
                const normalized = []
                for (const item of list) {
                    const itemUrl = typeof item?.url === 'string' ? item.url : ''
                    const filename = typeof item?.filename === 'string' ? item.filename : ''
                    if (!itemUrl || !filename) continue
                    const absoluteUrl = itemUrl.startsWith('http') ? itemUrl : `${this.baseUrl}${itemUrl}`
                    normalized.push({
                        filename,
                        url: absoluteUrl,
                        modified_at: item?.modified_at || null,
                    })
                }
                this.images = normalized
            } catch (err) {
                this.error = err && err.message ? err.message : 'Nie udało się pobrać listy zdjęć.'
            } finally {
                this.loading = false
            }
        },
        formatTime(iso) {
            if (!iso) return ''
            const clean = iso.replace('T', ' ')
            return clean.slice(0, 19)
        },
        openImage(image) {
            this.selectedImage = image
        },
    },
    mounted() {
        this.fetchImages()
    }
}
</script>

<template>
    <div class="gallery">
        <div class="gallery__header">
            <div class="gallery__back" @click="$router.back()">&larr; Powrót</div>
            <h2>Oznaczone zdjęcia</h2>
            <button class="gallery__refresh" @click="fetchImages" :disabled="loading">
                {{ loading ? 'Ładowanie…' : 'Odśwież' }}
            </button>
        </div>

        <p v-if="error" class="gallery__error">{{ error }}</p>
        <p v-else-if="loading" class="gallery__loading">Wczytywanie zdjęć…</p>
        <p v-else-if="images.length === 0" class="gallery__empty">Brak zdjęć do wyświetlenia.</p>

        <div v-else class="gallery__grid">
            <figure
                v-for="image in images"
                :key="image.url"
                class="gallery__item"
                @click="openImage(image)"
            >
                <img :src="image.url" :alt="image.filename" loading="lazy" />
                <figcaption>
                    <span class="gallery__name">{{ image.filename }}</span>
                    <span v-if="image.modified_at" class="gallery__time">{{ formatTime(image.modified_at) }}</span>
                </figcaption>
            </figure>
        </div>

        <div v-if="selectedImage" class="gallery__modal" @click.self="selectedImage = null">
            <div class="gallery__modal-body">
                <button class="gallery__close" type="button" @click="selectedImage = null">X</button>
                <img :src="selectedImage.url" :alt="selectedImage.filename" />
                <div class="gallery__meta">
                    <strong>{{ selectedImage.filename }}</strong>
                    <span v-if="selectedImage.modified_at">{{ formatTime(selectedImage.modified_at) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.gallery {
    background: var(--color-background-soft);
    border: 1px solid var(--color-border);
    border-radius: 10px;
    padding: 12px;
    color: var(--color-text);
    position: relative;
}

.gallery__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 12px;
}

.gallery__back {
    cursor: pointer;
    font-size: 14px;
    color: var(--blue);
}

.gallery__refresh {
    background: var(--blue);
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 6px 12px;
    cursor: pointer;
    transition: transform 0.1s ease-in-out;
}

.gallery__refresh:disabled {
    opacity: 0.6;
    cursor: default;
}

.gallery__refresh:not(:disabled):active {
    transform: scale(0.95);
}

.gallery__error,
.gallery__loading,
.gallery__empty {
    text-align: center;
    color: var(--vt-c-text-dark-2);
}

.gallery__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 12px;
}

.gallery__item {
    background: #fff;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out;
}

.gallery__item:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
}

.gallery__item img {
    width: 100%;
    height: 140px;
    object-fit: cover;
    display: block;
}

.gallery__item figcaption {
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    color: black;
}

.gallery__name {
    font-size: 13px;
    font-weight: 600;
    word-break: break-word;
}

.gallery__time {
    font-size: 12px;
}

.gallery__modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.78);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 1000;
}

.gallery__modal-body {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
}

.gallery__modal-body img {
    max-width: 90vw;
    max-height: 80vh;
    border-radius: 8px;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.4);
}

.gallery__close {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(50%, -50%);
    background: #fff;
    border: none;
    border-radius: 999px;
    width: 32px;
    height: 32px;
    cursor: pointer;
    font-weight: 700;
    z-index: 10;
}

.gallery__meta {
    color: #fff;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 4px;
}
</style>
