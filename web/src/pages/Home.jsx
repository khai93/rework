// Copyright 2022 Nang Khai.  All rights reserved.
// Use of this source code is governed by a GNU General Public License v3.0
// license that can be found in the LICENSE file.

import { useEffect } from "react"
import LinkedinApi from "../scrapers/linkedin";


export const HomePage = () => {

    useEffect(() => {
        const linkedinApi = new LinkedinApi();
        const search = async () => {
            console.log(await linkedinApi.searchJobs("web developer"));
        }
        search();
    }, []);

    return (
        <div>
            Hello from the homepage
        </div>
    )
}