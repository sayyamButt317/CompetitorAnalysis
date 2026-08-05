"use client";

import { useState } from "react";
import type { CompetitorAnalysisRequest } from "@/types/api";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { APP_COMPANY } from "@/lib/app-brand";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

interface AnalysisSetupModalProps {
  open: boolean;
  loading?: boolean;
  error?: string | null;
  onClose?: () => void;
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
  onClose,
  onSubmit,
}: AnalysisSetupModalProps) {
  const [companyData, setCompanyData] = useState("");
  const [region, setRegion] = useState("");
  const [instagramUsername, setInstagramUsername] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [competitorLimit, setCompetitorLimit] = useState(10);
  const [competitorsRaw, setCompetitorsRaw] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CompetitorAnalysisRequest = {
      company_data: companyData.trim(),
      region: region.trim(),
      competitors: parseCompetitors(competitorsRaw),
      competitor_limit: competitorLimit,
    };

    if (instagramUsername.trim()) {
      payload.instagram_username = instagramUsername.trim().replace(/^@/, "");
    }
    if (linkedinUrl.trim()) {
      payload.linkedin_url = linkedinUrl.trim();
    }

    onSubmit(payload);
  };

  return (
    <Modal
      open={open}
      closable={!loading}
      onClose={onClose}
      title="Start Competitor Analysis"
      description="Enter your company details, social profiles, and target region. Optionally add specific competitor handles."
    >
      <form onSubmit={handleSubmit} className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
        <div className="flex justify-center pb-2">
          <CompanyLogo variant="full" theme="light" name={APP_COMPANY.name} />
        </div>

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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            <label htmlFor="competitor_limit" className="mb-1.5 block text-sm font-medium text-slate-700">
              Competitor Limit
            </label>
            <input
              id="competitor_limit"
              type="number"
              min={1}
              max={50}
              value={competitorLimit}
              onChange={(e) => setCompetitorLimit(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="instagram_username" className="mb-1.5 block text-sm font-medium text-slate-700">
              Instagram Username <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              id="instagram_username"
              type="text"
              value={instagramUsername}
              onChange={(e) => setInstagramUsername(e.target.value)}
              placeholder="@yourbrand"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div>
            <label htmlFor="linkedin_url" className="mb-1.5 block text-sm font-medium text-slate-700">
              LinkedIn URL <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              id="linkedin_url"
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://www.linkedin.com/company/..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
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
