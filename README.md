# Pawlog

Welcome to Pawlog! This mobile application was developed by Chen Zhou, Anqi Guo and Chaoyi Shi.

## Description

Our app enhances the lives of dog owners and their furry companions through various features. Easily locate nearby dog parks for exciting adventures, while our interactive map turns your daily walks into memorable stories. Log routes, pin photos, and receive insightful summaries of your walks. Pawlog also offers exclusive deals on dog supplies and food, simplifies expense tracking, and provides detailed monthly reports.

Experience Pawlog, where every step is cherished, and managing your dog's needs is effortless.

## Pawlog App Demo
https://www.youtube.com/watch?v=hn8nNHya4NE

## Iteration 3 has added the following:
Notification

## Iteration 2 has added the following:
Authentication
Camera use
Location use
External API use (weather API)

## Data Model and Collections

### 1. Users:

Stores user-specific information such as email, phone number, username, and potentially a user profile picture.

- Create: Users are created upon signing up, initializing a user profile with username, email, and password. This operation would add a new document to the user's collection.

- Read: User profiles are read during login sessions or when displaying user profile information on the MyProfile screen.

Delete: For a user to delete their account, a delete operation on their document within the user's collection would be necessary. Meanwhile, the account will be removed from authentication data as well. 


### 2. Spending Records (spendRecord):

Tracks user spending, with each record containing information such as category, amount spent (price), and date of expenditure.

Create: The user adds new spending records through the "Add Item" screen, which represents a create operation.

- Read: Spending records are read and displayed in various parts of the app. The "Spend" screen displays a list of spending. On the home screen, spending in the last seven days is visualized by category.

- Update: Editing a spending record through an "Edit Item" screen would involve an update operation on specific documents within the spendRecord collection.

- Delete: Spending items can be deleted by clicking the trash icon. The corresponding record will be removed from the database. 

### 3. Walk Records (walkRecord):

Captures details about walking activities, including duration, distance, start time, and GPS coordinates for the route taken.

- Create: New walk records are created at the end of a walking session, capturing details like duration, distance, and GPS coordinates.

- Read: Walk records are read for display and analysis, such as in the "My Walks" and "Walk Report" screens, which show recent walks and performance metrics.

- Update: On the "My Walks" screen, the user can hit/unhit the heart icon of a walking record.

- Delete: Users can delete walk records by hitting the delete icon on the "My Walks" screen.

### 4. Photos(photos):

Store photos taken by the user and potentially with timestamps and GPS coordinates.

- Create: Users can upload photos.

- Read: Displaying photos in a gallery view on the MyPhotos screen. When a single photo is tapped, the related photo taken address info will be displayed. 

- Delete: Users can delete photos from their gallery.

### 5. Notification(notifications):

The app includes a feature for notifications.
- Read: Read notifications when they are displayed to the user. The creation, update, and deletion of notifications might be managed internally by the app's logic or through a third-party service. It might not directly interact with a Firestore collection as other data does.

### 6. Walk Plans (plans):
Stores walk plan information including city, location, date and time.
- Create: A user can create walk plans.
- Read: Walk Plans can be read on the "Community Screen"
- Update: A user can update his/her own walk plan
- Delete: A user can delete his/her own walk plan

## Screenshots

<img src=https://github.com/Lenore8963/pawlog/assets/121272886/e930eaab-5a6f-4cb5-9956-9219f367ca74 width="200"/>
<img src=https://github.com/Lenore8963/pawlog/assets/121272886/c1e1c849-a16d-4e65-81f3-03459320f111 width="200"/>
<img src=https://github.com/Lenore8963/pawlog/assets/121272886/0109a1df-ddcd-4703-a341-d5e462b152ff width="200"/>
<img src=https://github.com/Lenore8963/pawlog/assets/121272886/967e6bf3-b27c-4056-94d3-38978018636b width="200"/>
<img src=https://github.com/Lenore8963/pawlog/assets/121272886/3ebff14f-df81-44d3-806a-c3778929882e width="200"/>
<img src=https://github.com/Lenore8963/pawlog/assets/121272886/7a6280e5-cd16-4c87-b49f-da4f0566b167 width="200"/>
<img src=https://github.com/Lenore8963/pawlog/assets/121272886/717ca5a4-6316-4327-b7da-efaba5b649b7 width="200"/>
<img src=https://github.com/Lenore8963/pawlog/assets/121272886/f405474b-60c1-419f-9bdd-47a4e8b090a5 width="200"/>
<img src=https://github.com/Lenore8963/pawlog/assets/121272886/81fed211-17e2-4a02-b192-485733a36e26 width="200"/>
<img src=https://github.com/Lenore8963/pawlog/assets/121272886/9fb34477-c1fd-432d-9bf7-81fa67449c64 width="200"/>
<img src=https://github.com/Lenore8963/pawlog/assets/121272886/41188871-d9ea-44da-aebb-4b600d00c64d width="200"/>
<img src=https://github.com/Lenore8963/pawlog/assets/121272886/a103b6ad-8392-4b44-9558-6792faa734e1 width="200"/>
<img src=https://github.com/Lenore8963/pawlog/assets/121272886/99df42b3-e48d-4e0a-ace3-16fd58929211 width="200"/>
<img src=https://github.com/Lenore8963/pawlog/assets/121272886/4e9089f0-ed9a-4539-9c3b-c1a9b86b54c7 width="200"/>
<img src=https://github.com/Lenore8963/pawlog/assets/121272886/4fb3e220-18e3-40ad-b1f0-e8b683c5f0eb width="200"/>
<img src=https://github.com/Lenore8963/pawlog/assets/121272886/2d7da662-b6fa-490b-8320-b952ca50f5d9 width="200"/>
<img src=https://github.com/Lenore8963/pawlog/assets/121272886/e5ad1eaf-934a-46f8-80b2-5e9042f89989 width="200"/>
<img src=https://github.com/Lenore8963/pawlog/assets/121272886/2820ca99-4b8d-4d06-bb2e-1749beae37ff width="200"/>
<img src=https://github.com/Lenore8963/pawlog/assets/121272886/706a6917-b237-4008-ba51-c73556b23bb9 width="200"/>
<img src=https://github.com/Lenore8963/pawlog/assets/121272886/b6554a6e-4ad2-4a94-b317-ebcc9f71a6bb width="200"/>
<img src=https://github.com/Lenore8963/pawlog/assets/121272886/c8cad5e0-581e-4a92-baa8-7b5481cf5856 width="200"/>
<img src=https://github.com/Lenore8963/pawlog/assets/121272886/174af0d4-6de6-40b6-bdf2-92c6ce32240e width="200"/>
<img src=https://github.com/Lenore8963/pawlog/assets/121272886/2a71a61d-778b-490a-a4b0-6b781c346ce6 width="200"/>
<img src=https://github.com/Lenore8963/pawlog/assets/121272886/9b4a79e7-45ee-48e1-880b-cccc55a57eef width="200"/>
<img src=https://github.com/Lenore8963/pawlog/assets/121272886/b3e0d803-e59a-400f-978f-5c4ca90141a3 width="200"/>
<img src=https://github.com/Lenore8963/pawlog/assets/121272886/e99d4736-81bf-42b8-b6d3-2e20f4044700 width="200"/>
<img src=https://github.com/Lenore8963/pawlog/assets/121272886/6e2dd462-95b0-44b9-8452-2f6376f9839c width="200"/>

## Contributing

### Chen Zhou

- Determined the overall structure of the App.
- Had components created to represent the functionality
- Set up the three Navigators.
- Made the Spend feature work with basic CRUD.
- Fixed errors in the Spend feature.
- Added camera feature and saved photos with location information.
- Displayed a list of photos and locations on the "My Photos" screen.
- Users can mark a photo on the interactive map and delete photos.

### Anqi Guo

- Developed Sign up, Log in, Walk Track, Walk Report, and Walk History pages
- Integrated walk and user data with Firebase
- Implemented charts for Walk and Spend Report
- Retrieved data from an external weather API and displayed it on the Home screen
- Added markers of start and end points along with photos taken during the dog walk in the WalkRecord page
- Implemented local and push notifications. 

### Chaoyi Shi

- Completed Spend/AddItem/EditItem screens, making spend CRUD functions perform as expected.
- Developed a Spending Report feature showing past weekly spending data on the Home screen.
- Connected "spendRecord" collection to Firebase, CRUD can function.
- Added content to Home/Profile screens and fixed styles across screens.
- Worked on UI across screens and improved features to ensure the app was user-friendly.
- Tested iteration 2 & 3 to find bugs, imporve UI and fix bugs. 

## Current State

### Navigators:

1. All navigators are functioning, leading users to desired pages

### Connected APIs:

1. Google Map API:
-Used for Walk feature
-Track walk route
-Mark the start and end of a walk
-Mark the photo taken location when a photo is taken during a walk
2. Weather API
- Displays current weather for a user's location

### The Login feature is working:

1. A new user can create their profile by using an email address and creating a password
2. Existing users can directly "log in".
3. User data are connected to Firebase under the "users" collection.
4. The user can see his/her profile under the "My Profile" screen.
5. A user can delete his/her profile using "Delete Profile" on the "My Profile" screen.
6. A user can sign out on the "My Profile" screen.


### The Spend feature is working:

1. On the Home page, it displays spending records for the current week using a pie chart.
2. Press the bottom tab "Spend", then the user can go to the Spend page.
3. On the Spend page, it displays the spend record added by the user.
4. Press a spending record, and the user can go to the "Edit Item" page.
5. Press the "+" icon in the bottom of Spend screen, user can go to "Add Item" page.
6. With Firebase connected (collection: "spendRecord"), the user can add, edit and delete spending records.

### The Walking feature is working:

1. The Home page displays walk distance and duration data for the recent week using bar charts.
2. Navigating to the "Walk" tab at the bottom of the screen reveals a map interface alongside a "Go" button. Initiating the tracking process by tapping "Go" triggers the application to record the user's movement and time. As the user progresses, their route is dynamically displayed on the map. Once the walk is completed, tapping the "End" button stops the tracking process, and the walk's distance and duration are promptly displayed at the top of the screen.
3. Accessing the side menu, users can find an option labelled "My Walks." Selecting this option presents a list of all previously recorded walks. Tapping on a specific walk within the list provides users with detailed information about that particular walk, including the walk route with start/end points and photos taken while walking the dog.
4. On the "My Walks" screen, a user can like or delete walk records.

### Camera feature is working:

1. On the Walk page, the user can press the camera icon button and take a photo.
2. The user can see the preview of the photo and save the photo in the database.
3. On the "My Photos" page, it displays the photos added by the user.
5. The photos can be deleted when the user long presses a photo.

### Notification is working
1. User can create their own walk plans on "Community" Screen, it will trigger a local notification when it is time to walk the dog. The user can also edit and delete a walk plan.
2. A user can choose to join a walk plan created by other users, this will trigger push notifications to allow the plan owner know someone has joined his/her walk plan. 
3. If the walk plan owner updates/deletes a walk plan, the participants who join the walk plan will be notified through push notifications as well.
3. A participant can also quit the walk plan he/she joined. 


## Todo

1. Finish Authentication and Map features.
- Ensure the user uses a strong password; if not, give a more specific alert.
- User can only get their data.

2. Work on Notification feature
-Local notification for walk reminders
-Push notifications with weather info

3. Add alerts when a user signs out or deletes their profile on the "My Profile" screen
4. Keep testing the app and fix bugs
5. Change the user information display style on the "My Profile" page


## API Key
weatherApiKey="8ec483ffe9a4481fa9c212728240504"

## Firebase Rule
allow create, read, write, delete: if request.auth != null
