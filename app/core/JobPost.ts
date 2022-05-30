// Copyright 2022 Nang Khai.  All rights reserved.
// Use of this source code is governed by a GNU General Public License v3.0
// license that can be found in the LICENSE file.

export type JobPost = {
    name: string,
    description: string,
    company: {
        name: string,
        logoUrl: URL,
        link: URL
    },
    postedDate: Date,
    link: URL
}

/**
 * Serializes a JobPost object into a JSON parsable object
 * @param post 
 */
export const serializeJobPost = (post: JobPost) => ({
    ...post,
    company: {
        ...post.company,
        logoUrl: post.company.logoUrl.toString(),
        link: post.company.link.toString()
    },
    postedDate: post.postedDate.toString(),
    link: post.link.toString()
})