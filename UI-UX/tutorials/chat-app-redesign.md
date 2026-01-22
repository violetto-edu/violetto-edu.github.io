# Chat App Redesign

Let's begin our first experiment: A Chat App Redesign where we will create a wireframe and redesign the user interface of a well-known chat application. We will be using Figma as our design tool throughout this tutorial, as recommended by the university.

For our experiment, we'll focus on <span class="brand WhatsApp">WhatsApp</span>, a widely-used messaging platform from Meta. WhatsApp exemplifies excellent user interface design through its intuitive navigation, clear visual hierarchy, and consistent design patterns.

![WhatsApp interface on Apple iOS and Android](images/chat-app-redesign/whatsapp-user-interface.webp)
_New iOS and Android user interface on WhatsApp. Image courtesy of Meta Design, 2024._

Lets start with creating home screen interface of WhatsApp.

> **Disclaimer**:
>
> The images, logos, and brand elements of WhatsApp used in this application redesign are the intellectual property of WhatsApp Inc. and are utilized here for educational purposes only. This website is not affiliated with or endorsed by WhatsApp. All trademarks and copyrights are the property of their respective owners.
>
> Please ensure that all usage of WhatsApp logos, icons, and products adheres to their brand guidelines. For any commercial use or modifications, please obtain the necessary permissions from WhatsApp.

---

## 1. Wireframing

### What is a Wireframe?

A **wireframe** is a basic visual guide that represents the structure and layout of a digital interface. It serves as a blueprint for a design, focusing on the arrangement of elements without detailed styling or functionality. Wireframes help designers plan the user experience (UX) by defining the placement of key components such as navigation bars, buttons, and content sections before adding colors, images, or animations.

Create a basic wireframe using pen and paper, as demonstrated below:

![Wireframe](images/chat-app-redesign/wireframe.webp){data-aspect-ratio="1:1"}

---

## 2. Designing

We're going to need icons for designing this interface. The easiest way to get icons is by using plugins in Figma.

1. Let's download the [Iconify](https://www.figma.com/community/plugin/735098390272716381/iconify) and [Status bar](https://www.figma.com/community/plugin/1308736934209334550) plugin.

Pro tip: You can also search for the plugin directly within Figma and run it from the plugins menu.

> **Disclaimer**:
>
> The Helvetica Neue font is the intellectual property of its original author and is provided here for personal use only. This tutorial uses the font for educational purposes only. For commercial use, please ensure you obtain the appropriate license from the author. By downloading, you acknowledge that you respect the rights of the original creator.
>
> Note: You can download Helvetica Neue font **[here](https://violetto-edu.github.io/UI-UX/public/resources/Helvetica-Neue.zip)**.

### Creating a Frame

To create a frame:

1. We'll use the **Android Compact** frame for this design.
2. Change the fill color to **#0B1014**

![Creating a Frame](images/chat-app-redesign/design-1.webp)

### Adding the Status Bar

1. Open the Status Bar 1-click plugin from the Actions menu.
2. Change the height of the status bar to **50** pixels.

![Adding the Status Bar](images/chat-app-redesign/design-2.webp)

### Adding Header Container

1. Use the **Frame tool (F)** to add frame for header container for branding and buttons.
2. To change the layout and alignment, we will set the frame to auto layout by pressing **Shift+A**.
3. Configure frame:
   - Width: **412 (Hug)** pixels
   - Height: **50** pixels
   - Layout: Horizontal
   - Alignment: Center
   - Gap & Horizontal padding: **10** pixels
   - Vertical padding: **0**

![Adding Header Container](images/chat-app-redesign/design-3.webp)

### Adding Branding Sub-Container

1. Use the **Frame tool (F)** to add frame for branding sub-container inside header container.
2. Configure frame:
   - Width: **268** pixels
   - Height: **Fill**
   - Layout: Horizontal
   - Alignment: Top Left
   - Gap, Horizontal padding & Vertical padding: **10** pixels

![Adding the Branding Sub-Container](images/chat-app-redesign/design-4.webp)

### Adding the WhatsApp Branding

1. Use the **Text Tool (T)** to add "WhatsApp" in the branding area.
2. Configure the branding text:
   - Width & Height: **Fill**
   - Font: Medium/Bold
   - Size: **24** pixels

![Adding the WhatsApp Branding](images/chat-app-redesign/design-5.webp)

### Adding Buttons Sub-Container

1. Use the **Frame tool (F)** to add frame for branding sub-container inside header container.
2. Configure frame:
   - Width & Height: **Fill**
   - Layout: Horizontal
   - Alignment: Center
   - Gap: Auto
   - Vertical padding: **10** pixels
   - Horizontal padding: **0**

![Adding Buttons Sub-Container](images/chat-app-redesign/design-6.webp)

### Adding Scanner, Camera and Settings Icons

1. Search for Scanner, Camera and Dot icons in the Iconify plugin.
2. Configure icons:
   - Height: **25** pixels

![Adding Scanner, Camera and Settings Icon](images/chat-app-redesign/design-7.webp)

### Adding Body Container

1. Create a new frame for the body container:
2. Configure frame:
   - Width: **412** pixels
   - Height: **739** pixels
   - Layout: Vertical
   - Alignment: Top Center
   - Gap: **10** pixels
   - Horizontal padding: **0**
   - Vertical padding: **5** pixels

![Adding Body Container](images/chat-app-redesign/design-8.webp)

### Adding Search Container

1. Create a new frame for the body container:
2. Configure frame:
   - Width: **386** pixels
   - Height: **45** pixels
   - Layout: Horizontal
   - Alignment: Center
   - Gap: **8** pixels
   - Horizontal padding: **10** pixels
   - Vertical padding: **0**

![Adding Search Container](images/chat-app-redesign/design-9.webp)

### Creating the Search Bar

1. Add a search icon from iconify.
2. Configure icon:
   - Width & Height: **24** pixels
   - Selection Color: **#8F9498**
3. Create a new frame for the search:
   - Dimensions: **Fill**
   - Layout: Horizontal
   - Alignment: Left
   - Vertical padding: **2, 0** pixels
   - Horizontal padding: **0**
4. Add text "Ask Meta AI or Search" inside the frame.
   - Width & Height: **Hug**
   - Font: Regular
   - Size: **15** pixels
   - Color: **#8F9498**

![Creating the Search Bar](images/chat-app-redesign/design-10.webp)

### Adding Filter Button Container

1. Create a new frame for the filter button container:
2. Configure frame:
   - Width: **412** pixels
   - Height: **50** pixels
   - Layout: Horizontal
   - Alignment: Left
   - Horizontal padding: **15** pixels

![Adding Filter Button Container](images/chat-app-redesign/design-11.webp)

### Adding Filter Buttons

1. Design three distinct filter buttons:

   - "All" button:
     - Dimensions: **50 x 30** pixels
   - "Unread" button:
     - Dimensions: **80 x 30** pixels
   - "Groups" button:
     - Dimensions: **80 x 30** pixels

2. Apply consistent styling to the buttons:
   - Corner radius: **50** pixels
   - Color scheme:
     - First button (All): **#D9FDD3**
     - Other buttons: **#23282C**

![Adding Filter Buttons](images/chat-app-redesign/design-12.webp)

4. Add text to the buttons:
   - Font weight: Bold
   - Font size: **14** pixels
   - Text color scheme:
     - "All" button text: **#000000**
     - "Unread" and "Groups" text: **#8F9498**

![Adding Filter Buttons Text](images/chat-app-redesign/design-13.webp)

### Adding Contact Container

1. Create a contact container:
   - Width: **Fill**
   - Height: **71** pixels
   - Layout: Horizontal
   - Alignment: Left
   - Gap: **10** pixels
   - Horizontal padding: **15** pixels
   - Vertical padding: **4** pixels

![Adding Contact Container](images/chat-app-redesign/design-14.webp)

2. Add a profile icon:
   - Shape: Circle
   - Dimensions: **50 x 50** pixels
   - Represents the chat partner's profile picture

![Adding Profile Icon](images/chat-app-redesign/design-15.webp)

4. Create a contact sub-container:
   - Sub-container dimensions: **Fill**
   - Layout: Vertical
   - Alignment: Bottom Left
   - Represents a single conversation entry
   - Gap: **2** pixels
   - Horizontal padding: **0**
   - Vertical padding: **10** pixels

![Creating Contact Sub-Container](images/chat-app-redesign/design-16.webp)

5. Create a container for name and time:
   - Width: **Fill**
   - Height: **Hug**
   - Gap: Auto
   - Horizontal padding: **0**
   - Vertical padding: **2** pixels

![Creating Container for Name and Time](images/chat-app-redesign/design-17.webp)

6. Include text elements for name and time:
   - Contact name:
     - Size: **15** pixels
     - Weight: Regular
     - Color: **#E5E9EC**
   - Time:
     - Size: **12** pixels
     - Weight: Regular
     - Color: **#8F9498**

![Adding Text Elements](images/chat-app-redesign/design-18.webp)

7. Create a container for last message and icon:
   - Width: **Fill**
   - Height: **Hug**
   - Gap: Auto
   - Horizontal padding: **0, 2** pixels
   - Vertical padding: **2** pixels

![Creating Container Last Message and Icon](images/chat-app-redesign/design-19.webp)

8. Include text elements for last message and icon:
   - Last message:
     - Size: **14** pixels
     - Weight: Regular
     - Color: **#8F9498**
   - Import a pin icon of color **#686F74**

![Adding Text Elements](images/chat-app-redesign/design-20.webp)

9. Populate the chat list:
   - Duplicate the contact container
   - Create multiple entries

![Populate Chat List](images/chat-app-redesign/design-21.webp)

10. Customize chat entries:

- Modify names, messages, and times
- Create visual variety
- Represent different types of conversations

![Customize Chat Entries](images/chat-app-redesign/design-22.webp)

### Creating the Navigation Bar

1. Create the navigation frame:
   - Dimensions: **412 x 78** pixels
   - Layout: Horizontal
   - Alignment: Center
   - Gap, Horizontal padding & Vertical padding: **0**

![Creating the Navigation Bar](images/chat-app-redesign/design-23.webp)

2. Add Chat container:
   - Width: **100** pixels
   - Height: **Fill**
   - Layout: Horizontal
   - Alignment: Center
   - Gap: **10** pixels
   - Horizontal padding & Vertical padding: **0**

![Creating the Navigation Bar Buttons](images/chat-app-redesign/design-24.webp)

3. Add Chat Button:
   - Dimensions: **70 x 35** pixels
   - Alignment: Center
   - Corner radius: **50** pixels
   - Color: **#103629**
4. Add Chat icon:
   - Color: **#D9FDD3**
5. Add Chat text:
   - Font size: **12** pixels
   - Font weight: Medium

![Adding Navigation Bar Buttons](images/chat-app-redesign/design-25.webp)

6. Duplicate the container:
7. Change the color of remaining buttons to
   - Remaining buttons: **#0B1014**
8. Change navigation labels:
   - Labels: **Updates, Communities, Calls** accordingly

![Duplicate Navigation Bar Buttons](images/chat-app-redesign/design-26.webp)

### Final Design

With these meticulous steps, we've created a comprehensive, user-friendly design for the WhatsApp interface. The design balances functionality with aesthetic appeal, providing an intuitive user experience.

![Final Design](images/chat-app-redesign/design.webp){data-aspect-ratio="1:1"}

---
