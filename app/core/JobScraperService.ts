// Copyright 2022 Nang Khai.  All rights reserved.
// Use of this source code is governed by a GNU General Public License v3.0
// license that can be found in the LICENSE file.

import { JobPost } from "./JobPost";
import { Location } from "./Location";

export type JobSearchFilter = {
    location?: Location,
    remote?: boolean
}

/**
 * JobScraperService are services that scrapes websites related to searching for jobs
 */
export interface JobScraperService {
    search(keywords: string[], filters?: JobSearchFilter): Promise<JobPost[]>;
}