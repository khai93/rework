// Copyright 2022 Nang Khai.  All rights reserved.
// Use of this source code is governed by a GNU General Public License v3.0
// license that can be found in the LICENSE file.

import 'reflect-metadata';
import axios, { AxiosInstance } from "axios";
import { Container } from "inversify";
import { LinkedinJobScraper } from './linkedin';

const TYPES = {};

const container = new Container();
container.bind<LinkedinJobScraper>(LinkedinJobScraper).toSelf()
export {
    container
};