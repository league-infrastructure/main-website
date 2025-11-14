# 404 handling. 

[DONE] Here are some rules for a 404 page. If a URL is not found, use the following
processing rules to find another page to display:


    Check the redirects in src/data/redirects.ts first. 

    If the page path has a post permalink in it, like `2015/03/06/`, redirect to the
    `news` page ( insert `/news/` before the year in the date )

    `/donate/*` goes to `/donate`

    `/about/*` goes to `/about/`

    Anything with 'policy' goes to the policies page. 
    Anything with 'coding-programs' goes to the programs page. 
    Anything with "client" and "portal" in it redirects to `https://jtl.pike13.com/accounts/sign_in`

    Anything else goes to the 404 page. 

Most of this will be implemented in a client-side javascript program. We are deploying this with Github pages, so I think you will need to create a github 404 page that runs the program. 
