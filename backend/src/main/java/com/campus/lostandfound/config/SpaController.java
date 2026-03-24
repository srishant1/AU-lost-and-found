package com.campus.lostandfound.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Forwards all non-API, non-static-resource requests to index.html
 * so that React Router can handle client-side routing.
 */
@Controller
public class SpaController {

    // Forward all paths to index.html except those containing a period (files) or starting with /api
    @RequestMapping(value = { "{path:[^\\.]*}", "/**/{path:[^\\.]*}" })
    public String forward() {
        return "forward:/index.html";
    }
}
