document.addEventListener("DOMContentLoaded", () => {
    // Jalankan pengecekan lokasi secara otomatis saat halaman dimuat
    checkAndRequestLocation();

    // ==========================================
    // --- TOGGLE SIDEBAR BUKA/TUTUP ---
    // ==========================================
    const sidebarToggleBtn = document.getElementById("sidebarToggleBtn");
    const sidebar = document.querySelector(".sidebar");

    if (sidebarToggleBtn && sidebar) {
        sidebarToggleBtn.addEventListener("click", () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle("sidebar-open");
            } else {
                sidebar.classList.toggle("sidebar-closed");
            }
        });

        const navLinksList = document.querySelectorAll(".nav-link");
        navLinksList.forEach(link => {
            link.addEventListener("click", () => {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove("sidebar-open");
                }
            });
        });
    }

    // ==========================================
    // --- FUNGSI CUSTOM ALERT ---
    // ==========================================
    function showCustomAlert(message, type = "info") {
        const modal = document.getElementById("customAlertModal");
        const textElem = document.getElementById("customAlertText");
        const iconElem = document.getElementById("customAlertIcon");
        const btnElem = document.getElementById("customAlertBtn");

        if (!modal) return;

        textElem.innerText = message;

        if (type === "error") {
            iconElem.innerHTML = '<i class="fa-solid fa-circle-xmark" style="color: #ef4444;"></i>';
            btnElem.style.background = "#ef4444";
        } else if (type === "success") {
            iconElem.innerHTML = '<i class="fa-solid fa-circle-check" style="color: #22c55e;"></i>';
            btnElem.style.background = "#22c55e";
        } else {
            iconElem.innerHTML = '<i class="fa-solid fa-circle-info" style="color: #0ea5e9;"></i>';
            btnElem.style.background = "#0ea5e9";
        }

        modal.classList.remove("hidden");
    }

    if (document.getElementById("customAlertBtn")) {
        document.getElementById("customAlertBtn").addEventListener("click", () => {
            document.getElementById("customAlertModal").classList.add("hidden");
        });
    }

    // ==========================================
    // --- ELEMEN UTAMA & NAVIGASI ---
    // ==========================================
    const form = document.getElementById("poisonForm");
    const resetBtn = document.getElementById("resetBtn");
    const loadingStatus = document.getElementById("loadingStatus");
    const submitBtn = document.getElementById("submitBtn");
    const pdfBtn = document.getElementById("pdfBtn");
    const historyBody = document.getElementById("historyBody");
    const clearHistoryBtn = document.getElementById("clearHistoryBtn");
    const globalSearch = document.getElementById("globalSearch");
    const logOutput = document.getElementById("logOutput");
    const pageTitle = document.getElementById("pageTitle");
    const navLinks = document.querySelectorAll(".nav-link");
    const tabContents = document.querySelectorAll(".tab-content");

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove("active"));
            tabContents.forEach(c => c.classList.add("hidden"));

            link.classList.add("active");
            const targetTab = link.getAttribute("data-tab");
            document.getElementById(targetTab).classList.remove("hidden");
            
            pageTitle.innerText = link.innerText.trim();
        });
    });

    // ==========================================
    // --- PORTAL FASKES ---
    // ==========================================
    const faskesBtn = document.getElementById("faskesBtn");
    const faskesModal = document.getElementById("faskesModal");
    const closeFaskes = document.getElementById("closeFaskes");
    const faskesLoginForm = document.getElementById("faskesLoginForm");
    const userNameText = document.getElementById("userNameText");
    const userAvatarImg = document.getElementById("userAvatarImg");

    if (faskesBtn && faskesModal) {
        faskesBtn.addEventListener("click", () => {
            faskesModal.classList.remove("hidden");
        });
    }

    if (closeFaskes) {
        closeFaskes.addEventListener("click", () => faskesModal.classList.add("hidden"));
    }

    if (faskesLoginForm) {
        faskesLoginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const faskesName = document.getElementById("faskesName").value.trim();
            if (faskesName) {
                if (userNameText) userNameText.innerHTML = `<i class="fa-solid fa-user-check"></i> ${faskesName} (Faskes)`;
                if (userAvatarImg) userAvatarImg.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(faskesName)}&background=1e293b&color=fff`;
                appendLog(`[FASKES] ${faskesName} aktif dalam mode verifikasi klinis.`);
                showCustomAlert(`Selamat datang, Petugas ${faskesName}. Mode Faskes diaktifkan.`, "success");
            }
            faskesModal.classList.add("hidden");
            faskesLoginForm.reset();
        });
    }

    // ==========================================
    // --- ANALISIS MAKANAN LOKAL (DATABASE.JS) ---
    // ==========================================
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const makanan = document.getElementById("makanan").value;
            const gejala = document.getElementById("gejala").value;
            const jamKonsumsi = document.getElementById("jamKonsumsi").value;
            const durasiJam = parseInt(document.getElementById("durasiGejalaJam").value) || 0;

            const payload = {
                makanan: makanan,
                gejala: gejala,
                jam_konsumsi: jamKonsumsi,
                durasi_onset_jam: `${durasiJam} jam`,
                lokasi: document.getElementById("lokasi").value
            };

            loadingStatus.classList.remove("hidden");
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menganalisis...';

            appendLog(`[LOCAL] Menganalisis sampel '${payload.makanan}' secara lokal menggunakan database patogen...`);

            // Simulasi jeda singkat agar animasi loading terasa natural
            setTimeout(() => {
                try {
                    const resultData = computeLocalAnalysis(payload);
                    renderAnalysisResult(resultData);
                    saveToHistory(payload.makanan, resultData);
                    appendLog(`[SUCCESS] Analisis selesai. Skor Risiko: ${resultData.risk_score}`);
                } catch (error) {
                    showCustomAlert("Terjadi kesalahan saat memproses data.", "error");
                    console.error(error);
                    appendLog(`[ERROR] Gagal memproses data: ${error.message}`);
                } finally {
                    loadingStatus.classList.add("hidden");
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fa-solid fa-microchip"></i> Analisis dengan AI';
                }
            }, 600);
        });
    }

    // Fungsi Kalkulasi dan Pencocokan Lokal Berbasis database.js
    function computeLocalAnalysis(report) {
        const symptoms_lower = report.gejala.toLowerCase();
        const food_lower = report.makanan.toLowerCase();
        
        let computed_score = 3.2;
        const onset_hours = parseFloat(report.durasi_onset_jam) || 6.0;

        if (["demam", "darah", "kejang", "pingsan", "sesak", "penglihatan ganda", "sulit menelan"].some(k => symptoms_lower.includes(k))) {
            computed_score = onset_hours < 24 ? 8.8 : 8.0;
        } else if (["muntah", "diare", "kram", "mulas", "menggigil"].some(k => symptoms_lower.includes(k))) {
            computed_score = onset_hours < 5 ? 6.5 : 5.5;
        }

        let matched_pathogen = null;
        if (typeof PATHOGENS_DATABASE !== 'undefined' && PATHOGENS_DATABASE.length > 0) {
            for (let p of PATHOGENS_DATABASE) {
                let match_found = false;
                for (let g of (p.gejala_khas || [])) {
                    if (symptoms_lower.includes(g.toLowerCase())) {
                        match_found = true;
                        break;
                    }
                }
                for (let m of (p.makanan_berisiko || [])) {
                    if (food_lower.includes(m.toLowerCase())) {
                        match_found = true;
                        break;
                    }
                }
                if (match_found) {
                    matched_pathogen = p;
                    break;
                }
            }
            if (!matched_pathogen) {
                matched_pathogen = PATHOGENS_DATABASE[0];
            }
        }

        return {
            risk_summary: `Analisis Risiko Klinis Berdasarkan Standar ${matched_pathogen ? matched_pathogen.referensi_lembaga : 'WHO/CDC'}`,
            risk_score: computed_score,
            potential_pathogens: [
                {
                    name: matched_pathogen ? matched_pathogen.nama_patogen : "Patogen Umum Makanan",
                    description: `Korelasi klinis antara gejala '${report.gejala}' dan masa inkubasi ${report.durasi_onset_jam} sesuai karakteristik patogen.`,
                    symptom: report.gejala,
                    source: `Analisis kontaminasi pada sampel: ${report.makanan}`
                }
            ],
            detected_symptoms: report.gejala.split(",").map(s => s.trim()).filter(s => s.length > 0),
            first_aid_recommendations: matched_pathogen ? matched_pathogen.pertolongan_pertama : ["Berikan cairan elektrolit dan rehidrasi mandiri."],
            lab_inspection_steps: matched_pathogen ? matched_pathogen.lab_inspection_steps : ["Lakukan kultur sampel pada media selektif."]
        };
    }

    if (resetBtn) {
        resetBtn.addEventListener("click", (e) => {
            e.preventDefault();
            form.reset();
        });
    }

    if (pdfBtn) {
        pdfBtn.addEventListener("click", () => {
            const element = document.getElementById("exportArea");
            pdfBtn.style.display = "none";

            const options = {
                margin:       [10, 10, 10, 10],
                filename:     'Laporan_Analisis_SIRePan.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { 
                    scale: 2, 
                    useCORS: true, 
                    letterRendering: true,
                    windowWidth: document.getElementById("exportArea").scrollWidth // Menyesuaikan lebar elemen agar tidak terpotong di HP
                },
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            html2pdf().set(options).from(element).save().then(() => {
                pdfBtn.style.display = "inline-block";
            }).catch(err => {
                console.error("Gagal export PDF:", err);
                pdfBtn.style.display = "inline-block";
            });
        });
    }

    if (globalSearch) {
        globalSearch.addEventListener("input", (e) => {
            const term = e.target.value.toLowerCase();
            const history = JSON.parse(localStorage.getItem("foodSafetyHistory")) || [];
            const filtered = history.filter(item => 
                item.makanan.toLowerCase().includes(term) || 
                item.risk_summary.toLowerCase().includes(term)
            );
            renderHistoryTable(filtered);
        });
    }

    // ==========================================
    // --- GEOLOCATION & WEATHER RISK WIDGET ---
    // ==========================================
    let userCoords = null;
    const locationModal = document.getElementById("locationPermissionModal");
    const grantLocationBtn = document.getElementById("grantLocationBtn");
    const denyLocationBtn = document.getElementById("denyLocationBtn");

    function checkAndRequestLocation() {
        if (!navigator.geolocation) {
            fetchWeatherAndRiskIndex(-6.2088, 106.8456);
            loadHistory();
            return;
        }

        navigator.permissions?.query({ name: 'geolocation' }).then((result) => {
            if (result.state === 'granted') {
                executeGetPosition();
            } else if (result.state === 'prompt') {
                if (locationModal) locationModal.classList.remove("hidden");
            } else {
                fetchWeatherAndRiskIndex(-6.2088, 106.8456);
                loadHistory(); 
            }
        }).catch(() => {
            if (locationModal) locationModal.classList.remove("hidden");
        });
    }

    function executeGetPosition() {
        if (locationModal) locationModal.classList.add("hidden");
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userCoords = { lat: position.coords.latitude, lon: position.coords.longitude };
                fetchWeatherAndRiskIndex(userCoords.lat, userCoords.lon);
                loadHistory();
                appendLog("[SYSTEM] Akses lokasi dan cuaca lokal berhasil diperoleh.");
            },
            () => {
                fetchWeatherAndRiskIndex(-6.2088, 106.8456);
                loadHistory();
                appendLog("[SYSTEM] Akses lokasi ditolak oleh pengguna.");
            },
            { timeout: 10000, enableHighAccuracy: true }
        );
    }

    if (grantLocationBtn) {
        grantLocationBtn.addEventListener("click", () => executeGetPosition());
    }

    if (denyLocationBtn) {
        denyLocationBtn.addEventListener("click", () => {
            if (locationModal) locationModal.classList.add("hidden");
            fetchWeatherAndRiskIndex(-6.2088, 106.8456);
            loadHistory();
            showCustomAlert("Akses lokasi dilewati. Peringatan wilayah menggunakan data umum.", "info");
        });
    }

    async function fetchWeatherAndRiskIndex(lat, lon) {
        const widgetContainer = document.getElementById("weatherRiskWidget");
        const tempIndicator = document.getElementById("weatherTempIndicator");
        
        if (!widgetContainer) return;

        try {
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`);
            if (!response.ok) throw new Error("Gagal memuat data cuaca");
            
            const data = await response.json();
            const temp = data.current.temperature_2m;

            if (tempIndicator) {
                tempIndicator.innerText = `${temp}°C (Lokal)`;
            }

            let riskHTML = "";
            if (temp >= 30) {
                riskHTML = `
                    <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 12px; border-radius: 6px; display: flex; align-items: flex-start; gap: 12px;">
                        <div style="background: #ef4444; color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 1rem;">
                            <i class="fa-solid fa-temperature-high"></i>
                        </div>
                        <div>
                            <p style="font-size: 0.85rem; color: #991b1b; line-height: 1.4; margin-bottom: 4px;">
                                <strong>Suhu Cukup Tinggi (${temp}°C):</strong> Bakteri berkembang biak sangat cepat pada suhu ini.
                            </p>
                            <p style="font-size: 0.8rem; color: #7f1d1d;">
                                <strong>Peringatan:</strong> Makanan berkuah santan, olahan protein, dan nasi sisa mudah basi dalam <strong>&lt; 3 jam</strong> di suhu ruang. Segera masukkan ke dalam kulkas!
                            </p>
                        </div>
                    </div>
                `;
            } else if (temp >= 24) {
                riskHTML = `
                    <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 12px; border-radius: 6px; display: flex; align-items: flex-start; gap: 12px;">
                        <div style="background: #0ea5e9; color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 1rem;">
                            <i class="fa-solid fa-cloud-sun"></i>
                        </div>
                        <div>
                            <p style="font-size: 0.85rem; color: #0369a1; line-height: 1.4; margin-bottom: 4px;">
                                <strong>Suhu Lingkungan Hangat (${temp}°C):</strong> Kondisi normal untuk aktivitas harian.
                            </p>
                            <p style="font-size: 0.8rem; color: #03588c;">
                                <strong>Saran:</strong> Makanan matang sebaiknya dikonsumsi atau dihangatkan kembali sebelum <strong>4–5 jam</strong> jika dibiarkan di meja makan.
                            </p>
                        </div>
                    </div>
                `;
            } else {
                riskHTML = `
                    <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 12px; border-radius: 6px; display: flex; align-items: flex-start; gap: 12px;">
                        <div style="background: #10b981; color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 1rem;">
                            <i class="fa-solid fa-snowflake"></i>
                        </div>
                        <div>
                            <p style="font-size: 0.85rem; color: #065f46; line-height: 1.4; margin-bottom: 4px;">
                                <strong>Suhu Sejuk (${temp}°C):</strong> Lingkungan relatif aman dari percepatan pembusukan bakteri.
                            </p>
                            <p style="font-size: 0.8rem; color: #047857;">
                                <strong>Tips:</strong> Makanan bertahan sedikit lebih lama, namun tetap pastikan penutup makanan tertutup rapat dari lalat atau debu.
                            </p>
                        </div>
                    </div>
                `;
            }

            widgetContainer.innerHTML = riskHTML;

        } catch (error) {
            console.warn("Gagal mengambil data cuaca:", error);
            if (tempIndicator) tempIndicator.innerText = "30°C (Standar)";
            widgetContainer.innerHTML = `
                <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 12px; border-radius: 6px; display: flex; align-items: flex-start; gap: 12px;">
                    <div style="background: #0ea5e9; color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 1rem;">
                        <i class="fa-solid fa-cloud-sun"></i>
                    </div>
                    <div>
                        <p style="font-size: 0.85rem; color: #0369a1; line-height: 1.5;">
                            Suhu rata-rata terpantau hangat. Hindari membiarkan makanan berkuah santan atau protein di suhu ruang lebih dari 4 jam.
                        </p>
                    </div>
                </div>
            `;
        }
    }

    function calculateDistance(lat1, lon1, lat2, lon2) {
        if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c; 
    }

    function saveToHistory(makanan, resultData) {
        const history = JSON.parse(localStorage.getItem("foodSafetyHistory")) || [];
        const newEntry = {
            id: Date.now(),
            date: new Date().toLocaleDateString("id-ID", { hour: '2-digit', minute: '2-digit' }),
            makanan: makanan,
            risk_summary: resultData.risk_summary,
            risk_score: resultData.risk_score,
            fullData: resultData,
            coords: userCoords ? { lat: userCoords.lat, lon: userCoords.lon } : null
        };

        history.unshift(newEntry);
        localStorage.setItem("foodSafetyHistory", JSON.stringify(history));
        loadHistory();
    }

    function loadHistory() {
        const history = JSON.parse(localStorage.getItem("foodSafetyHistory")) || [];
        renderHistoryTable(history);
        updateDashboardStats(history);
    }

    function renderHistoryTable(dataList) {
        if (!historyBody) return;
        historyBody.innerHTML = "";

        if (dataList.length === 0) {
            historyBody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 15px; color: #94a3b8;">Belum ada riwayat laporan.</td></tr>`;
            return;
        }

        dataList.forEach(item => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="padding: 10px;">${item.date}</td>
                <td style="padding: 10px; font-weight: bold;">${item.makanan}</td>
                <td style="padding: 10px;">${item.risk_summary}</td>
                <td style="padding: 10px;"><strong>${item.risk_score}</strong>/10</td>
                <td style="padding: 10px; text-align: center;">
                    <button class="view-history-btn" style="background: #0D8ABC; color: white; border: none; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                        <i class="fa-solid fa-eye"></i> Lihat
                    </button>
                </td>
            `;

            // Event listener yang aman untuk tombol Lihat
            const btn = tr.querySelector(".view-history-btn");
            btn.addEventListener("click", () => {
                restoreAnalysis(item.fullData);
            });

            historyBody.appendChild(tr);
        });
    }

    // ==========================================
    // --- DASHBOARD KESEHATAN MASYARAKAT ---
    // ==========================================
    function updateDashboardStats(history) {
        const alertBanner = document.querySelector(".alert-banner");
        const alertText = document.getElementById("alertText");
        const publicTotal = document.getElementById("publicTotal");
        const publicDigestive = document.getElementById("publicDigestive");
        const publicUrgent = document.getElementById("publicUrgent");

        const now = Date.now();
        const DURATION_14_DAYS = 14 * 24 * 60 * 60 * 1000;

        let recentHistory = history.filter(item => (now - item.id) <= DURATION_14_DAYS);

        if (userCoords) {
            recentHistory = recentHistory.filter(item => {
                if (!item.coords) return true;
                const dist = calculateDistance(userCoords.lat, userCoords.lon, item.coords.lat, item.coords.lon);
                return dist <= 10;
            });
        }

        const total = recentHistory.length;
        const urgentCases = recentHistory.filter(h => h.risk_score >= 7);

        if (alertBanner) {
            alertBanner.classList.remove("status-green", "status-yellow", "status-red");
            let bannerIcon = alertBanner.querySelector(".banner-icon");

            if (total >= 10) {
                alertBanner.classList.add("status-red");
                if (bannerIcon) bannerIcon.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
                if (alertText) {
                    alertText.innerText = `PERHATIAN TINGGI: Terdapat ${total} laporan keracunan (${urgentCases.length} kasus berat) di wilayah Anda! Hindari jajanan berisiko tinggi.`;
                }
            } else if (total >= 5) {
                alertBanner.classList.add("status-yellow");
                if (bannerIcon) bannerIcon.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
                if (alertText) {
                    alertText.innerText = `WASPADA: Terdeteksi ${total} laporan keracunan makanan di sekitar Anda. Tetap berhati-hati dalam memilih makanan luar.`;
                }
            } else {
                alertBanner.classList.add("status-green");
                if (bannerIcon) bannerIcon.innerHTML = '<i class="fa-solid fa-shield-halved"></i>';
                if (alertText) {
                    alertText.innerText = "Kondisi lingkungan terpantau aman. Belum ada lonjakan kasus keracunan makanan di sekitar Anda dalam 2 minggu terakhir.";
                }
            }
        }

        if (publicTotal) publicTotal.innerText = total;
        if (publicDigestive) publicDigestive.innerText = total;
        if (publicUrgent) publicUrgent.innerText = urgentCases.length;
    }

    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener("click", () => {
            if (confirm("Apakah Anda yakin ingin menghapus semua riwayat analisis?")) {
                localStorage.removeItem("foodSafetyHistory");
                loadHistory();
                appendLog("[SYSTEM] Semua riwayat analisis berhasil dihapus.");
            }
        });
    }

    function appendLog(msg) {
        if (logOutput) {
            const time = new Date().toLocaleTimeString("id-ID");
            logOutput.innerText += `\n[${time}] ${msg}`;
            logOutput.scrollTop = logOutput.scrollHeight;
        }
    }

    window.renderAnalysisResult = function(data) {
        const emptyState = document.getElementById("emptyState");
        const resultContainer = document.getElementById("analysisResultContainer");

        if (emptyState) emptyState.classList.add("hidden");
        if (resultContainer) resultContainer.classList.remove("hidden");

        document.getElementById("riskText").innerText = data.risk_summary;
        document.getElementById("riskScore").innerText = data.risk_score;
        
        const percentage = Math.min(Math.max((data.risk_score / 10) * 100, 0), 100);
        document.getElementById("riskFill").style.width = `${percentage}%`;

        const patogenContainer = document.getElementById("patogenContainer");
        patogenContainer.innerHTML = "";
        data.potential_pathogens.forEach((p, index) => {
            const bgClass = index % 2 === 0 ? "blue-bg" : "red-bg";
            const iconClass = index % 2 === 0 ? "fa-virus" : "fa-bacteria";
            
            patogenContainer.innerHTML += `
                <div class="patogen-card">
                    <div class="patogen-icon ${bgClass}"><i class="fa-solid ${iconClass}"></i></div>
                    <div class="patogen-info">
                        <h4>${p.name}</h4>
                        <p><strong>Deskripsi:</strong> ${p.description}<br><strong>Gejala Khas:</strong> ${p.symptom}<br><strong>Sumber/Mekanisme:</strong> ${p.source}</p>
                    </div>
                </div>
            `;
        });

        const gejalaTags = document.getElementById("gejalaTags");
        gejalaTags.innerHTML = "";
        data.detected_symptoms.forEach(sym => {
            gejalaTags.innerHTML += `<span class="tag"><i class="fa-solid fa-circle-check"></i> ${sym}</span>`;
        });

        const firstAidList = document.getElementById("firstAidList");
        firstAidList.innerHTML = "";
        data.first_aid_recommendations.forEach(item => {
            firstAidList.innerHTML += `<li><span class="dot"></span> ${item}</li>`;
        });

        const labList = document.getElementById("labList");
        labList.innerHTML = "";
        data.lab_inspection_steps.forEach(item => {
            labList.innerHTML += `<li><span class="dot"></span> ${item}</li>`;
        });
    };

    window.restoreAnalysis = function(data) {
        renderAnalysisResult(data);
        const analysisNavLink = document.querySelector("[data-tab='analysis-tab']");
        if (analysisNavLink) analysisNavLink.click();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
});