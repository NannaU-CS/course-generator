(async () => {
    const term = "2025-2026-1"; // MODIFY THIS IF NEEDED


    const url = "https://ehallapp.nju.edu.cn/jwapp/sys/kcbcx/modules/qxkcb/qxfbkccx.do";
    const pageSize = 999;

    let allRows = [];

    async function fetchPage(pageNumber) {
        const payload = {
            CXYH: true,
            querySetting: JSON.stringify([
                { "name": "XNXQDM", "caption": "学年学期", "linkOpt": "AND", "builderList": "cbl_m_List", "builder": "m_value_equal", "value": term, "value_display": "2025-2026学年 第1学期" },
                [[
                    { "name": "RWZTDM", "value": "1", "linkOpt": "and", "builder": "equal" },
                    { "name": "RWZTDM", "linkOpt": "or", "builder": "isNull" }
                ]],
                { "name": "CXYH", "value": true, "linkOpt": "AND", "builder": "equal" },
                { "name": "*order", "value": "+KKDWDM,+KCH,+KXH", "linkOpt": "AND", "builder": "m_value_equal" }
            ]),
            "*order": "+KKDWDM,+KCH,+KXH",
            pageSize: pageSize.toString(),
            pageNumber: pageNumber.toString()
        };

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
            body: new URLSearchParams(payload)
        });

        return response.json();
    }

    const firstPageData = await fetchPage(1);
    if (!firstPageData.datas?.qxfbkccx?.rows) {
        console.error("No Course Data found: ", firstPageData);
        return;
    }

    allRows.push(...firstPageData.datas.qxfbkccx.rows);

    const totalSize = firstPageData.datas.qxfbkccx.totalSize;
    const totalPages = Math.ceil(totalSize / pageSize);

    console.log(`Total #row: ${totalSize}, total #page: ${totalPages}`);

    for (let page = 2; page <= totalPages; page++) {
        const pageData = await fetchPage(page);
        if (pageData.datas?.qxfbkccx?.rows) {
            allRows.push(...pageData.datas.qxfbkccx.rows);
        }
        console.log(`${page}/${totalPages} pages finished`);
    }

    if (allRows.length > 0) {
        const headers = Object.keys(allRows[0]);
        const csvContent = [
            headers.join(","),
            ...allRows.map(r => headers.map(h => `"${(r[h] ?? "").toString().replace(/"/g, '""')}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `full_${term}.csv`;
        link.click();

        console.log("CSV saved.");
    } else {
        console.error("No course data to save.");
    }
})();
