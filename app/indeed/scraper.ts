// Copyright 2022 Nang Khai.  All rights reserved.
// Use of this source code is governed by a GNU General Public License v3.0
// license that can be found in the LICENSE file.

import { JobPost } from "@/core/JobPostService";
import { JobSearchService, JobSearchFilter } from "@/core/JobSearchService";
import { injectable } from "inversify";
import { parseFetchResponseHTML, parseFetchResponseText } from "../util/parseFetchResponse";

export type IndeedParseResult = {
    companyBrandingAttributes?: {
        logoUrl?: string,
        headerImageUrl?: string
    },
    company: string,
    companyRating: number,
    companyOverviewLink: string,
    expired: boolean,
    title: string,
    urgentlyHiring: boolean,
    viewJobLink: string,
    remoteLocation: boolean,
    formattedRelativeTime: string
}

@injectable()
export class IndeedJobScraper implements JobSearchService {
    async search(keywords: string[], filters?: JobSearchFilter): Promise<JobPost[]> {
        const requestURL = new URL("https://www.indeed.com/jobs");
        requestURL.searchParams.append("q", keywords.join(" "));
        requestURL.searchParams.append("start", filters?.page ? String(Math.max((filters.page - 1) * 10, 0)) : '0');
        
        if (filters?.remoteType) {
            if (filters.remoteType === 1) {
                requestURL.searchParams.append("sc", "0kf%3Aattr(DSQF7)%3B");
            }
            if (filters.remoteType === 2) {
                requestURL.searchParams.append("sc", "0kf%3Aattr(VAMUB)%3B");
            } 
        }

        if (filters?.location) {
            requestURL.searchParams.append("l", filters.location);
        }

        const { _body } = await parseFetchResponseText(await fetch(requestURL.toString(), { 
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246",
                "Host": requestURL.host
            },
            credentials: "same-origin"
        }));

        const output: JobPost[] = [];

        const mainMatch = _body.match(/window\.mosaic\.providerData\["mosaic-provider-jobcards"]={(.*)};/m);

        if (mainMatch == null) {
            throw new Error('Linkedin data regex unexpectedly did not work.');
        }

        for (let result of Array.from(JSON.parse(`{${mainMatch[1]}}`).metaData.mosaicProviderJobCardsModel.results) as IndeedParseResult[]) {
            result = result as any;
            output.push({
                job_title: result.title,
                company: {
                    company_name: result.company,
                    company_link: new URL("https://www.indeed.com" + result.companyOverviewLink),
                    logoUrl: new URL(result.companyBrandingAttributes?.logoUrl || "http://placehold.jp/64x64.png")
                },
                job_link: new URL("https://www.indeed.com" + result.viewJobLink),
                postedDate: null,
                formattedDate: result.formattedRelativeTime
            });
        }

        return output
    }
}