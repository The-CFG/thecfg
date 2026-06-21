// ── CloudBrowse: 공개 차트 목록 / 상세 조회 ────────────────────────────────
// 비로그인 상태에서도 조회 가능하도록 RLS 정책이 설계되어 있다.

const CloudBrowse = {

    // ── 공개 차트 목록 ─────────────────────────────────────────────────────────
    // options: { sort: 'newest'|'popular', search: string, page: number }
    async listPublicCharts(options = {}) {
        const { sort = 'newest', search = '', page = 0, pageSize = 20 } = options;

        let query = _supabase
            .from('beat_charts')
            .select('id, title, artist, bpm, lane_count, difficulty_label, note_count, play_count, created_at, owner_id', { count: 'exact' })
            .eq('is_public', true);

        if (search.trim()) {
            const keyword = search.trim();
            query = query.or(`title.ilike.%${keyword}%,artist.ilike.%${keyword}%`);
        }

        if (sort === 'popular') {
            query = query.order('play_count', { ascending: false });
        } else {
            query = query.order('created_at', { ascending: false });
        }

        query = query.range(page * pageSize, (page + 1) * pageSize - 1);

        return await query;
    },

    // ── 차트 상세 (메타 + Storage 경로) ──────────────────────────────────────
    async getChartDetail(chartId) {
        return await _supabase
            .from('beat_charts')
            .select('*')
            .eq('id', chartId)
            .eq('is_public', true)
            .single();
    },
};