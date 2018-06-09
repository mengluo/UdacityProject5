# UdacityProject5
Neighbourhood App

## Intro
> This is a single-page application featuring a map of a neighborhood of east London, UK. It is implemented using google map API and Wikimedia API. And there are five map markers to identify popular locations nearby.
> A search/filter function is added to easily discover these locations. A list view is to support simple browsing of all five locations.

## Requirements
  - A modern browser such as Chrome, IE or Firefox
  - All the location data needed are hardcoded in Neighbourhood App.

## Download and Run
  - Download/Clone the project folder `UdacityProject5` from [GitHub](https://github.com/mengluo/UdacityProject5)
  - Open root folder and you can see two folders: `css ` and `js`, and two files `index.html` and `README.md`. `index.html` is the page you would need to run in order to use the Neighbourhood app. It will load all resources from `css` and `js` folders.
  - `style.css` in `css` folder is to stylish the app page. `Neighbourhood.js` in `js` folder is the major logic interacting with the app page. `jquery-3.3.1.min.js` and `knockout-3.4.2.js` in `js` folder are javascript libraries used by Neighbourhood App.
  - To run the app, you only need to open the `index.html` using your favorite browser.


## User Manual
* The app has two sections. Right section is the map that shows 5 markers on map to indicate where the 5 locations are located in neighbourhood of east London. Left section is the menu that displays a list view of names of the 5 locations.
* Both the 5 names on menu and markers will be displayed by default when the page is loaded.
* The menu provides a filter option that uses an input field to filter both the list view and the map markers displayed by default on load. The list view and the markers will update accordingly in real time as you typing into the filter.
* Either clicking a location on the list or a marker on map displays unique information about the location, and animates its associated map marker (bouncing effect)
* The info about specific location will be populated in a info window attached to the marker. It contains the name of the location, the streeview of the location(provided by google streeview API) and the wiki descriptions(provided by wikimedia api)
