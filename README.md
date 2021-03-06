# Accessible PDF Maker

## How to Run this project on Ubuntu Server (21)
### get prince
sudo apt-get update
sudo apt-get install build-essential procps curl file git

wget https://www.princexml.com/download/prince_14.1-1_ubuntu20.04_amd64.deb
sudo gdebi $PIC # where $PIC is the path to the downloaded deb

### get pandoc 
wget https://github.com/jgm/pandoc/releases/download/2.13/pandoc-2.13-1-amd64.deb
sudo dpkg -i $DEB  # where $DEB is the path to the downloaded deb

### get npm
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

### get the project
git clone https://github.com/AtlasZ98/accessiblePDF.git
cd accessiblePDF
npm start


## Weekly Status
### Week of 09/26/2020 - 10/02/2020
**Things Done:**
- Had the first meeting with the sponsor.
  - Obtained some info about current process to make accessible PDF :
    - https://chi2021.acm.org/for-authors/presenting/papers/guide-to-an-accessible-submission
    - https://assets19.sigaccess.org/creating_accessible_pdfs.html
    - https://webaim.org/techniques/acrobat/converting
    - https://github.com/petergramaglia/access_sigchi
  - Expected priority of development:
    1. Less manual work on generating accessible PDFs
    2. Avoid Adobe Acrobat Pro to reduce accessibility cost for users
    3. Batch processing capability
- Some research about PDF format:
  - https://web.archive.org/web/20141010035745/http://gnupdf.org/Introduction_to_PDF#General_structure
- Engineering Diagram
     
     
  ![Engineering Diagram](/engineeringDiagram.png "Engineering Diagram")
       
      
- User Consideration
  1. Deliverable goals are listed in "Expected priority of development" section above.
  2. The app should protect user’s data and privacy. If the app is stealing the user's PDF when they upload it, that user will not want to use the app. Because of this, this project will not use a database for our web application, and no information about a user will be stored in any way.
  3. The app itself should be fully accessible. While this should be true of all products, since this project is specifically for adding accessibility, it would be diappointing if itself fails to meet common accessibility requirements.
  

**Things Planned:**
1. Will have the second meeting with the sponsor next Friday.
2. Research more on existing libraries/packages that could help decoding/making PDF files with accessible elements. If certain language/framework has some powerful packages already, this project will incline to use that in order to avoid re-inventing the wheel.
3. Think about tech stack.

### Week of 10/03/2020 - 10/09/2020
**Things Done:**
- Finally got into CS Slack. -_-#
- Did more research about PDF format:
  - https://web.archive.org/web/20141010035745/http://gnupdf.org/Introduction_to_PDF#General_structure
- Found a promising npm packages on PDF:
  - https://www.npmjs.com/package/pdfkit
  
**Difficulties and Failures:**
- Team wasn't productive in this week. Communication wasn't smooth as members are having their midterms.
- Meeting with the sponsor was cancelled but rescheduling hasn't been done since she was on vacation.
- Team weighing on tech stacks. Web frameworks seem easy to pick up and use but Python seems good, too. During the summer, Code for Good had already made a Ruby on Rails app that provides a web interface for this project. Although there wasn't mcuh achinevement on the PDF side, we could still continue from there.  

**Things Planned:**
1. Planned meeting with the sponsor was postponed. Will have the meeting this week.
2. Research more on existing libraries/packages that could help decoding/making PDF files with accessible elements.
3. Need to discuss whether to make a web app (so we can use the existing npm packages which seems to be pretty helpful) or start with a local app programmed in C/C++/Python.


### Week of 10/10/2020 - 10/16/2020
**Things Done:**
- Had the second meeting with Dr. Short. Scheduled next meeting on two weeks from today.
- Read some articles that contain helpful informations on the PDF accessibiltiy topic:
  - https://www.pdfa.org/wp-content/uploads/2013/08/PDFUA-in-a-Nutshell-PDFUA.pdf
  - https://helpx.adobe.com/acrobat/using/creating-accessible-pdfs.html#:~:text=%20Workflow%20for%20creating%20accessible%20PDFs%20%201,In%20Acrobat%20Pro%2C%20this%20stage%20includes...%20More%20
- Found more libraries on PDF:
  - https://www.pdflib.com/
  - https://pdf-lib.js.org/docs/api/index#const-beginmarkedcontent (JavaScript)
  - https://hexapdf.gettalong.org/ (Ruby)
  - https://pypi.org/project/PyPDF2/ (Python)
  
**Difficulties and Failures:**
- Found this post when looking for some libraries to tag PDFs (for accessibility labels): https://tex.stackexchange.com/questions/579/how-can-tagged-pdfs-be-created-that-support-universal-accessibility-and-reflowin. It seems that many people tried the same thing but eventually gave up. Their previous work is disconitnued. 

**Things Planned:**
1. Try those different libraries found to see if any of them is helpful. 
2. Get the Ruby on Rail project from Tufts Code for Good up and running to see if there is anything we can build up upon.
3. Begin research on if LaTeX source files will be needed in order to make an accessible PDF, and how to parse LaTeX if needed

### Week of 10/17/2020 - 10/23/2020
**Things Done:**
- Investigated the different PDF libraries. We believe pdflib will suit our needs and are getting close to committing to a tech stack based on these findings
- Did some preliminary research on the usefulness of LaTeX files in tagging a PDF. Short answer, we will probably need to use LaTeX source code to some degree. We might even be able to design a small LaTeX package to allow inserting tags and alt text in LaTeX
  - http://www.tug.org/TUGboat/tb30-2/tb95moore.pdf
- Assessed our risks and created a chart outlining the most prominent risks associated with our project.
  
**Difficulties and Failures:**
- As with last week, it seems that people have tried to do what we need to do, with limited success. No industry-standard tool for creating tagged PDFs exists. Many failed or deprecated projects have been found in our research.
- It is time-consuming to set up an environment to test a PDF library, and to write enough code to be satisfied with the functionality of the library. We did not test each library equally because of these issues, and it's possible we will use a library that isn't the best of our options.

**Things Planned:**
- Work on a project to show competency for the upcoming assignment. Create a presentation based on this display of competency.
- Continue to research LaTeX source code and the possibility of user-provided metadata and alt text within the LaTeX source code.

### Week of 10/24/2020 - 10/30/2020
**Things Done:**
- Met with Dr. Short and discussed the possibility of creating tagged PDFs by converting LaTeX -> HTML -> tagged PDF, since HTML is already in a tagged format.
- Found the 'Prince' software (https://www.princexml.com/), which can convert HTML to a tagged PDF. The free version puts a watermark on the resulting PDF, but this can be avoided by buying a license for the software.
  
**Difficulties and Failures:**
- None of the libraries found have an API for adding tags to a PDF. These libraries are useful if we know what objects are needed to create a tag in the PDF format, but do not offer this themselves.
- There just aren't enough resources about how to tag a PDF online. It seems to require significant expertise in the PDF format to get creating tagged PDFs correct.
- Dr. Short does not love our LaTeX -> HTML -> tagged PDF plan, since it has inconsistent effects on formatting. She has encouraged us to continue researching how to add tags to a PDF without using HTML, but that is much more difficult.

**Things Planned:**
- Reach out to the Prince development team to ask for support. If Prince has developed a method for creating a tagged PDF, they might be willing to share their knowledge of creating tagged PDFs to aide our work.
- Touch base with Ming on if he knows any alumni who have done work on PDFs or are currently working on PDFs.
- Complete New Competency Proficiency Demo.

### Week of 10/31/2020 - 11/06/2020
**Things Done:**
- Completed the New Competency Proficiency Demo.
- Ran basic trials of our LaTeX -> HTML -> tagged PDF solution, to varying degrees of success.
- Reached out to the Prince development team for any support they may be able to provide. No response as of yet.
- Completed Design Doc
  
**Difficulties and Failures:**
- In some cases, our solution of converting through HTML demolishes the formatting of the original LaTeX file. We may be able to remedy some of this by improving the formatting as we see blatent errors, but it is unlikely we will be able to guarentee an identical resulting tagged PDF with this current solution.
- Our best hope for creating a product that generates identical tagged PDFs to the PDF generated by LaTeX is support from Prince, but they have not responded to us.

**Things Planned:**
- Continue checking email for a response from Prince (fingers crossed...)
- Begin thinking about our proof-of-concept demo for the end of the semester. Ideally, this will be based on a part of our project which will be needed regardless of whether we get support from Prince on tagging a PDF.


### Week of 11/7/2020 - 11/13/2020
**Things Done:**
- Gotten a few responses from the Prince development team. Will continue to communicate with them and ask for help.
- Met with Dr.Short and discussed the LaTeX -> HTML -> tagged PDF trials we ran previously and some alternative solutions (providing two resulting files, one tagged but with bad formatting for screen readers, one original untagged file for general users).

**Difficulties and Failures:**
- Prince responded to us, but admitted that tagging PDFs directly is extremely hard and that they have failed before turning to the HTML middleground.
- Our LaTeX -> HTML -> tagged PDF solution will work, but the formatting will be difficult to maintain. Mostly because LaTeX has not been interested in sharing and improving their formatting techniques. Luckily, theoratically, we do not need any formatting for the tagged version of the file, because users with the help of screen readers will be listening, not looking at the file directly. That also means we are separating the paper into two files, one tagged w/o formatting and one untagged w/ formatting.

**Things Planned:**
- Continue to communicate with Prince and hopefully get them officially involved in the project (if necessary).
- Think about time management. If we don't have enough time, we will go with the solution of generating two files to avoid formatting issues.


### Week of 11/14/2020 - 11/20/2020
**Things Done:**
- Sent Dr.Short the Design Doc of our project and received feedback from her.
- Found some useful tutorials on how to execute shell commands in NodeJS:
  - https://stackabuse.com/executing-shell-commands-with-node-js/
  - https://nodejs.org/api/child_process.html

**Difficulties and Failures:**
- The guy from Prince didn't reply to our questions during the past week. Hope he was just busy...
- Not every person on the team is familiar with NodeJS and we need to figure out a way to automate the conversion on the server side rather than manually type the commands (like what we did in the proficiency demo)

**Things Planned:**
- Follow the tutorial to aumoate the two-stage converision through NodeJS script. Luckily I'm taking OS so the executing shell commands in NodeJS through child processes seems understandable.
- Try implementing a simple server that does the two-stage conversion during Thanksgiving.

### Final Status Report

**Do you use source control?**
Yes. this Github repository houses our code.

**Can you make a build in one step?**
No.

**Do you make daily builds?**
No.

**Do you have a bug database?**
No.

**Do you fix bugs before writing new code?**
Yes.

**Do you have an up-to-date schedule?**
No.

**Do you have a spec?**
No.

**Do programmers have quiet working conditions?**
Yes.

**Do you use the best tools money can buy?**
No. Limited (actually, nonexistent) funding.

**Do you have testers?**
We are our own testers。

**Do new candidates write code during their interview?**
Yes. We have not had an interview where the candidate did not write code.

**Do you do hallway usability testing?**
No.

We have a lot to add to this project next semester to better manage our code. Notably, a schedule and a spec will be very useful, once they exist. Also, organizing our bugs as we find them will help us minimize the risk of forgetting to fix an issue with our product.


### Week of 02/08/2021 - 02/12/2021
**Things Done:**
- Had the first meeting with Dr. Short. 
  - Obtained some new links: 
    
    - existing online tool to do the convertion ==> https://www.robobraille.org/
    - Python toolkit to extract PDF content ==> https://pdfminersix.readthedocs.io/en/latest/
    - Official PDF standard specification ==> https://www.adobe/com/content/dam/acom/en/devnet/pdf/pdfs/PDF32000_2008.pdf

**Difficulties and Failures:**
- PDF standard specification is HUGE.

**Things Planned:**
- Resume communication with the Prince Guy on decoding PDF format.
- Wait on Dr. Short's meeting with Adobe to see if there could be SDK available for tagging PDF files.


### Week of 02/13/2021 - 02/19/2021
**Things Done:**
- Started reading and testing files and websites Dr. Short and we obtained during the break and our first meeting.
- Finished updating our project requirements and semester plan.

**Difficulties and Failures:**
- Our sponsor, Dr. Short, did not get back to us about her meeting with Adobe. Might have to remind her next week.

**Things Planned:**
- See if we need to shift our focus to user interface and image tagging or stay to crack multiple-files-tagging issues.
- Think of how to stand out among competitors and make our sponsor satisfied at the same time.
- Finish reading all the new information and resources.

### Week of 02/20/2021 - 02/26/2021
**Things Done:**
- Meeting with Dr. Short. Received update on her meeting with Adobe.
- Tried RoboBraile which works very well.

**Difficulties and Failures:**
- RoboBraile seems to have our project's functionality but better. We need to change our plan to do something meaningful, like integrating their convertion tool to our web application which will have better front end built around producing PDFs.
- Adobe documentation is not very readable. Adobe SDK APIs are not easy to use.
- RoboBraile still doesn't handle math equations.

**Things Planned:**
- Explore the Adobe APIs for accessiblity.
- Reach out to RoboBraile to see if they are willing to share their convertion method (code/tool) for acessible PDF.
- Explore the possiblity to convert math equations.
