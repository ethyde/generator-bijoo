Bijoo-Generator
===============

# Introduction
First try to make a Yeoman Generator to prepare, scafold, install a project.

# Installation

If you have never use Yeoman before
```npm install -g yo bower grunt-cli```

This Generator are not published; so to test, or use it :

* clone the repo using ```git clone https://github.com/ethyde/generator-bijoo.git```
* navigate to the root folder ```cd generator-bijoo```
* use ```npm link``` to create a node symlink

And now you will be able to use ```yo bijoo``` in any project

## Bijoo ask to you !

During installation process, bijoo-generator will ask you some informations.

* What is the project name ? Answer without space.
* What is devellopement envirinoment URL (i.g. : http://url_of_project.dev) ?.
* Do you use a CMS or a FRamework ? It's used to prevent copy of some files like .gitignore, .htaccess, etc.
* The name of the folder, if needed with route (ig : src/bundleAcme/), where to put your assets (css, js, img).
* Same as before, but for destination
* Do you want to use Babel.JS for ES6 transpiling ? Default : No

# Copyright and license

Loosely based and build for enhancement of [BijooStrap](https://github.com/balix/bijoostrap).

Code and documentation by Ethyde. Code released under [the MIT license](https://github.com/twbs/bootstrap/blob/master/LICENSE). Docs released under [Creative Commons](https://github.com/twbs/bootstrap/blob/master/docs/LICENSE).