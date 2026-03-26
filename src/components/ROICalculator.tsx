"use client";

import { useState, useCallback, useId } from "react";
import { useTranslations } from "next-intl";
import type { ROIRow } from "@/types";

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

const defaultRows: ROIRow[] = [
    { id: generateId(), missionName: "", points: 0, time: 1 },
    { id: generateId(), missionName: "", points: 0, time: 1 },
    { id: generateId(), missionName: "", points: 0, time: 1 },
];

function getRoiColor(roi: number): string {
    if (roi > 0.6) return "text-success bg-success/10";
    if (roi >= 0.4) return "text-warning bg-warning/10";
    return "text-error bg-error/10";
}

function getRoiBarColor(roi: number): string {
    if (roi > 0.6) return "bg-success";
    if (roi >= 0.4) return "bg-warning";
    return "bg-error";
}

export default function ROICalculator() {
    const t = useTranslations("roi");
    const [rows, setRows] = useState<ROIRow[]>(defaultRows);
    const tableId = useId();

    const updateRow = useCallback((id: string, field: keyof ROIRow, value: string | number) => {
        setRows((prev) =>
            prev.map((row) =>
                row.id === id ? { ...row, [field]: value } : row
            )
        );
    }, []);

    const addRow = useCallback(() => {
        setRows((prev) => [
            ...prev,
            { id: generateId(), missionName: "", points: 0, time: 1 },
        ]);
    }, []);

    const removeRow = useCallback((id: string) => {
        setRows((prev) => prev.filter((row) => row.id !== id));
    }, []);

    const sortByRoi = useCallback(() => {
        setRows((prev) => {
            const sorted = [...prev].sort((a, b) => {
                const roiA = a.time > 0 ? a.points / a.time : 0;
                const roiB = b.time > 0 ? b.points / b.time : 0;
                return roiB - roiA;
            });
            return sorted;
        });
    }, []);

    const exportCsv = useCallback(() => {
        const header = "Mission Name,Points,Time (sec),ROI\n";
        const csv = rows
            .map((row) => {
                const roi = row.time > 0 ? (row.points / row.time).toFixed(2) : "0.00";
                return `"${row.missionName}",${row.points},${row.time},${roi}`;
            })
            .join("\n");

        const blob = new Blob([header + csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "roi_calculator.csv";
        a.click();
        URL.revokeObjectURL(url);
    }, [rows]);

    const maxRoi = Math.max(...rows.map((r) => (r.time > 0 ? r.points / r.time : 0)), 1);

    return (
        <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <span className="text-xl">📊</span>
                    {t("title")}
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={sortByRoi}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-accent/15 text-accent border border-accent/20 hover:bg-accent/25 transition-colors"
                    >
                        {t("sortByRoi")}
                    </button>
                    <button
                        onClick={exportCsv}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-success/15 text-success border border-success/20 hover:bg-success/25 transition-colors"
                    >
                        {t("exportCsv")}
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm" id={tableId}>
                    <thead>
                        <tr className="border-b border-surface-lighter/30">
                            <th className="py-3 px-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                                {t("missionName")}
                            </th>
                            <th className="py-3 px-3 text-center text-xs font-semibold text-muted uppercase tracking-wider w-20">
                                {t("points")}
                            </th>
                            <th className="py-3 px-3 text-center text-xs font-semibold text-muted uppercase tracking-wider w-24">
                                {t("time")}
                            </th>
                            <th className="py-3 px-3 text-center text-xs font-semibold text-muted uppercase tracking-wider w-32">
                                {t("roi")}
                            </th>
                            <th className="py-3 px-3 w-10"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => {
                            const roi = row.time > 0 ? row.points / row.time : 0;
                            const roiRounded = roi.toFixed(2);
                            const roiPercent = (roi / maxRoi) * 100;

                            return (
                                <tr
                                    key={row.id}
                                    className="border-b border-surface-lighter/10 hover:bg-surface-lighter/20 transition-colors"
                                >
                                    <td className="py-2 px-3">
                                        <input
                                            type="text"
                                            value={row.missionName}
                                            onChange={(e) => updateRow(row.id, "missionName", e.target.value)}
                                            placeholder={t("mission_placeholder")}
                                            className="w-full bg-transparent text-slate-300 placeholder-surface-lighter focus:outline-none focus:text-white text-sm"
                                        />
                                    </td>
                                    <td className="py-2 px-3">
                                        <input
                                            type="number"
                                            value={row.points || ""}
                                            onChange={(e) =>
                                                updateRow(row.id, "points", parseInt(e.target.value) || 0)
                                            }
                                            min={0}
                                            className="w-full bg-transparent text-center text-slate-300 focus:outline-none focus:text-white text-sm"
                                        />
                                    </td>
                                    <td className="py-2 px-3">
                                        <input
                                            type="number"
                                            value={row.time || ""}
                                            onChange={(e) =>
                                                updateRow(row.id, "time", parseInt(e.target.value) || 1)
                                            }
                                            min={1}
                                            className="w-full bg-transparent text-center text-slate-300 focus:outline-none focus:text-white text-sm"
                                        />
                                    </td>
                                    <td className="py-2 px-3">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-2 bg-surface-lighter rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-500 ${getRoiBarColor(roi)}`}
                                                    style={{ width: `${roiPercent}%` }}
                                                />
                                            </div>
                                            <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${getRoiColor(roi)}`}>
                                                {roiRounded}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-2 px-1">
                                        <button
                                            onClick={() => removeRow(row.id)}
                                            className="p-1 text-muted hover:text-error transition-colors rounded"
                                            title={t("removeRow")}
                                        >
                                            ✕
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <button
                onClick={addRow}
                className="mt-4 w-full py-2.5 rounded-lg border border-dashed border-surface-lighter/40 text-muted text-sm hover:border-accent/40 hover:text-accent transition-colors"
            >
                + {t("addRow")}
            </button>
        </div>
    );
}
