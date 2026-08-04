"use client";

import { useState } from "react";
import type { CompanyBasedTrendsRequest } from "@/types/trends";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";

interface TrendDiscoverFormProps {
  loading?: boolean;
  error?: string | null;
  onSubmit: (payload: CompanyBasedTrendsRequest) => void;
}

function parseList(raw: string): string[] {
  return raw
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20";

export function TrendDiscoverForm({ loading = false, error, onSubmit }: TrendDiscoverFormProps) {
  const [companyData, setCompanyData] = useState("");
  const [region, setRegion] = useState("");
  const [instaUsername, setInstaUsername] = useState("");
  const [linkedinUsername, setLinkedinUsername] = useState("");
  const [xUsername, setXUsername] = useState("");
  const [facebookUsername, setFacebookUsername] = useState("");
  const [redditUsername, setRedditUsername] = useState("");
  const [competitorsRaw, setCompetitorsRaw] = useState("");
  const [competitorLimit, setCompetitorLimit] = useState(10);
  const [includeWebTrends, setIncludeWebTrends] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CompanyBasedTrendsRequest = {
      company_data: companyData.trim(),
      region: region.trim(),
      competitor_limit: competitorLimit,
      include_web_trends: includeWebTrends,
    };

    if (instaUsername.trim()) payload.instausername = instaUsername.trim();
    if (linkedinUsername.trim()) payload.linkedinusername = linkedinUsername.trim();
    if (xUsername.trim()) payload.xusername = xUsername.trim();
    if (facebookUsername.trim()) payload.facebookusername = facebookUsername.trim();
    if (redditUsername.trim()) payload.redditusername = redditUsername.trim();

    const competitors = parseList(competitorsRaw);
    if (competitors.length > 0) payload.competitors = competitors;

    onSubmit(payload);
  };

  return (
    <Card>
      <CardHeader
        title="Discover Trends"
        subtitle="Submit company details and social handles to fetch personalized trend analysis"
      />

      <form onSubmit={handleSubmit} className="space-y-5">
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
            placeholder="Company profile: services, positioning, target audience, niche..."
            className={inputClass}
          />
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
              placeholder="e.g. GCC, Pakistan, North America"
              className={inputClass}
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
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-slate-700">Social Usernames</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <input
              type="text"
              value={instaUsername}
              onChange={(e) => setInstaUsername(e.target.value)}
              placeholder="Instagram username"
              className={inputClass}
            />
            <input
              type="text"
              value={linkedinUsername}
              onChange={(e) => setLinkedinUsername(e.target.value)}
              placeholder="LinkedIn username"
              className={inputClass}
            />
            <input
              type="text"
              value={xUsername}
              onChange={(e) => setXUsername(e.target.value)}
              placeholder="X username"
              className={inputClass}
            />
            <input
              type="text"
              value={facebookUsername}
              onChange={(e) => setFacebookUsername(e.target.value)}
              placeholder="Facebook username"
              className={inputClass}
            />
            <input
              type="text"
              value={redditUsername}
              onChange={(e) => setRedditUsername(e.target.value)}
              placeholder="Reddit username"
              className={inputClass}
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
            placeholder="@competitor1, @competitor2 — comma or newline separated"
            className={inputClass}
          />
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={includeWebTrends}
            onChange={(e) => setIncludeWebTrends(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          Include web trends crawl
        </label>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className="w-full justify-center sm:w-auto"
          icon={
            loading ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : undefined
          }
        >
          {loading ? "Fetching trends..." : "Run Trend Discovery"}
        </Button>
      </form>
    </Card>
  );
}
