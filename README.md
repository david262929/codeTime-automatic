# codeTime-automatic
[automatic](http://lab.codetime.am)

##Setup
    * Git Clone
    * Install Packages
    * If not under deveopment mode, will install pm2 npmpackage globally too

##Requirments
    * Node > v.10
    * Git
    * Redis-server
   
##Navigations
    * Automatic
    * Settings
    * Login
    * Register
   
##What you can do
    * Input types.
        * Upload a ZIP file.
        * Pass a link for scrapper can download a website.
    * Save all img's in img dir.
        * If folder named a images will rename.
            * Images Folder.
            * Images attaching in HTML.
            * Images attaching in CSS.
    * Save all css's in css dir.
    * Product Name Replacement.
    * Css Autoprefixer.
    * Image Compress. (Less then tinyPng)
    * Adding data-hash attr.
    * Anchor tags refactor
        * Value of Href attr to {offer}
        * Remove Target attr
        * Add country code
    * Comment all script tags in html.
    * Comment all script tags in html.
    * Attach a packages.
        * Jquery.
        * LeadProfit.
        * Price js.
        * Translator. 
    * Queue worker.
        * All requests to "automatic" will push in queue, which stores in REDIS.
    * User Account.
        * Data Save in Redis
        * Add Telegram ID after queue works ending for send Forkes Downlaod Zip Link, to telegram account  
    * Telegram BOT
        After first logging user will start a bot in his telegram account and send "/getmyid" command for getting his telegram ID. 
    
## License
[GNU](https://choosealicense.com/licenses/gpl-3.0/)