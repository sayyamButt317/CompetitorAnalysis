"use client";

import { useState } from "react";
import type { CompetitorAnalysisRequest } from "@/types/api";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

interface AnalysisSetupModalProps {
  open: boolean;
  loading?: boolean;
  error?: string | null;
  onSubmit: (payload: CompetitorAnalysisRequest) => void;
}

function parseCompetitors(raw: string): string[] {
  return raw
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function AnalysisSetupModal({
  open,
  loading = false,
  error,
  onSubmit,
}: AnalysisSetupModalProps) {
  const [companyData, setCompanyData] = useState("");
  const [region, setRegion] = useState("");
  const [competitorsRaw, setCompetitorsRaw] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      company_data: companyData.trim(),
      region: region.trim(),
      competitors: parseCompetitors(competitorsRaw),
    });
  };

  return (
    <Modal
      open={open}
      title="Start Competitor Analysis"
      description="Enter your company details and target region. Optionally add specific competitor handles."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="company_data" className="mb-1.5 block text-sm font-medium text-slate-700">
            Company Details
          </label>
          <textarea
            id="company_data"
            required
            minLength={20}
            rows={5}
            value={companyData}
            onChange={(e) => setCompanyData(e.target.value)}
            placeholder="Paste company profile: services, positioning, ideal clients, etc."
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <p className="mt-1 text-xs text-slate-400">Minimum 20 characters</p>
        </div>

        <div>
          <label htmlFor="region" className="mb-1.5 block text-sm font-medium text-slate-700">
            Region
          </label>
          <input
            id="region"
            type="text"
            required
            minLength={2}
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="e.g. GCC, MENA, North America"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div>
          <label htmlFor="competitors" className="mb-1.5 block text-sm font-medium text-slate-700">
            Competitors <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <textarea
            id="competitors"
            rows={3}
            value={competitorsRaw}
            onChange={(e) => setCompetitorsRaw(e.target.value)}
            placeholder="@competitor1, @competitor2 — one per line or comma-separated"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className="w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
          icon={
            loading ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : undefined
          }
        >
          {loading ? "Analyzing..." : "Run Analysis"}
        </Button>
      </form>
    </Modal>
  );
}
