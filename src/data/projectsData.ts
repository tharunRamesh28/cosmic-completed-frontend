// Centralized Project Data for Cosmic Circuit Portfolio
export interface Project {
  id: string;
  number: string;
  title: string;
  filename: string;
  category: string;
  categories: string[];
  shortDescription: string;
  overview: string;
  problem: string;
  solution: string;
  features: string[];
  operation: string[];
  technologies: string[];
  applications: string[];
  outcome: string;
  highlights: string[];
  slug: string;
  image: string;
}

import projectImg_01 from '../../projects/Automatic LPG Gas Leak Detection & Safety System.png';
import projectImg_02 from '../../projects/Bluetooth-Controlled Robotic Arm.png';
import projectImg_03 from '../../projects/Smart Medicine Reminder System.png';
import projectImg_04 from '../../projects/Smart Flood Detection & Early Warning System.png';
import projectImg_05 from '../../projects/Color Detection & Identification System using ESP32-CAM.png';
import projectImg_06 from '../../projects/Automatic Fire Fighting System.png';
import projectImg_07 from '../../projects/Automatic Home Automation System.png';
import projectImg_08 from '../../projects/Chill Chain – Smart Milk Quality & Vendor Tracking System.png';
import projectImg_09 from '../../projects/Smart air quality & multi-gas monitoring system.png';
import projectImg_10 from '../../projects/SMART AUTOMATIC CLOTHES COLLECTOR SYSTEM.png';
import projectImg_11 from '../../projects/SMART ENERGY MONITORING & AUTOMATIC LIGHTING.png';
import projectImg_12 from '../../projects/Smart Irrigation System.png';
import projectImg_13 from '../../projects/Smart Parking Management System.png';
import projectImg_14 from '../../projects/Smart Patient Bed Fall Detection & Alert System.png';
import projectImg_15 from '../../projects/Sound Reactive LED System.png';
import projectImg_16 from '../../projects/Temperature Monitoring & SMS Alert System.png';
import projectImg_17 from '../../projects/Vehicle Cabin Air Quality Monitoring & Smart Purification System.png';
import projectImg_18 from '../../projects/Autonomous Delivery Robot with Pick-and-Drop System.png';

export const PROJECTS_DATA: Project[] = [
  {
    id: "autonomous-delivery-robot",
    number: "01",
    title: "Autonomous Delivery Robot with Pick-and-Drop System",
    filename: "Autonomous Delivery Robot with Pick-and-Drop System",
    category: "ROBOTICS \u00b7 AUTONOMOUS SYSTEMS \u00b7 EMBEDDED SYSTEMS",
    categories: ["ALL", "ROBOTICS", "AUTOMATION", "EMBEDDED"],
    shortDescription: "An autonomous mobile robotic system designed to automate material transportation through an intelligent pickup, navigation, transportation and drop-off workflow. The robot collects materials from a designated pickup location and delivers them to the assigned destination using an integrated pick-and-drop mechanism.",
    overview: "The Autonomous Delivery Robot with Pick-and-Drop System is an intelligent robotic platform developed to automate material transportation between designated locations.\n\nThe system combines mobile robotics, autonomous movement and a robotic pickup-and-drop mechanism to perform delivery tasks with reduced manual intervention.\n\nIt is designed to identify the assigned pickup and drop locations, collect the required material, transport it and complete the delivery process.",
    problem: "Manual material transportation in workplaces, laboratories, warehouses and industrial environments requires continuous human involvement.\n\nTraditional transportation methods can involve:\n• Repetitive manual material handling.\n• Time-consuming movement between locations.\n• Dependence on human operators for transportation.\n• Difficulty managing repeated delivery tasks.\n• Safety challenges when transporting materials through busy environments.",
    solution: "The proposed system uses an autonomous mobile robot integrated with a material pickup-and-drop mechanism.\n\nThe robot receives a delivery task, identifies the assigned pickup and destination points, navigates along its planned route, collects the material and transports it to the designated drop location.\n\nThe system aims to improve transportation efficiency, reduce repetitive manual work and demonstrate intelligent robotic automation.",
    features: [
      "Autonomous Robot Movement",
      "Pickup Location Selection",
      "Automated Material Collection",
      "Integrated Pick-and-Drop Mechanism",
      "Destination-Based Delivery",
      "Obstacle Detection and Avoidance",
      "Controlled Material Transportation",
      "Automated Delivery Workflow",
      "Robotic System Coordination",
      "Reduced Manual Intervention"
    ],
    operation: [
      "01 \u2014 Task Selection: The user selects the required pickup location and delivery destination.",
      "02 \u2014 Route Planning: The robot determines its route between the assigned locations using its implemented navigation system.",
      "03 \u2014 Autonomous Navigation: The robot moves towards the designated pickup location.",
      "04 \u2014 Pickup Identification: The system identifies the pickup position and prepares the collection mechanism.",
      "05 \u2014 Material Pickup: The robotic mechanism collects the designated material.",
      "06 \u2014 Delivery Navigation: The robot transports the collected material towards the destination.",
      "07 \u2014 Drop Location Identification: The robot identifies the assigned drop position.",
      "08 \u2014 Material Drop: The pickup-and-drop mechanism places the material at the designated destination.",
      "09 \u2014 Mission Completion: The delivery task is marked complete."
    ],
    technologies: [
      "Mobile Robot Chassis",
      "Microcontroller / Embedded Controller",
      "Robotic Arm / Gripper Actuation",
      "Servo / DC Motor Drives",
      "Obstacle Detection Sensors",
      "Navigation / Route Guidance System",
      "Power Management / LiPo Battery Pack",
      "Hardware Confirmation Pending"
    ],
    applications: [
      "Warehouse Material Transportation",
      "Industrial Material Handling",
      "Laboratory Equipment Delivery",
      "Smart Manufacturing Facilities",
      "Institutional and Campus Delivery",
      "Internal Logistics Automation",
      "Research and Development Facilities",
      "Smart Factory Environments"
    ],
    outcome: "The project demonstrates the integration of mobile robotics and automated material handling into a unified delivery workflow.\n\nThe system focuses on combining autonomous transportation with a controlled pickup-and-drop process to reduce repetitive manual material movement.\n\nWorkflow: TASK SELECTION \u2192 ROUTE PLANNING \u2192 AUTONOMOUS NAVIGATION \u2192 MATERIAL PICKUP \u2192 TRANSPORTATION \u2192 MATERIAL DROP \u2192 DELIVERY COMPLETION",
    highlights: [
      "AUTONOMOUS MOBILITY — Designed to transport materials between assigned locations.",
      "INTELLIGENT PICKUP — Integrates a mechanism for collecting designated materials.",
      "SMART TRANSPORTATION — Combines robotic movement with delivery task execution.",
      "CONTROLLED DROPOFF — Performs material placement at the assigned destination.",
      "ROBOTIC AUTOMATION — Demonstrates the integration of mobile robotics and material handling."
    ],
    slug: "autonomous-delivery-robot",
    image: projectImg_18
  },
  {
    id: "automatic-lpg-gas-leak-detection-safety-system",
    number: "02",
    title: "Automatic LPG Gas Leak Detection & Safety System",
    filename: "Automatic LPG Gas Leak Detection & Safety System",
    category: "SAFETY \u00b7 IoT",
    categories: ["ALL", "SAFETY", "EMBEDDED", "IoT"],
    shortDescription: "An automated LPG safety system that detects gas leakage, provides immediate visual and audible alerts, and can activate a servo-controlled mechanism to shut off the gas supply.",
    overview: "The Automatic LPG Gas Leak Detection & Safety System is a safety-focused embedded system designed to continuously monitor the environment for LPG gas leakage and provide an immediate warning when abnormal gas levels are detected.\n\nThe system combines gas sensing, embedded processing, visual indication, audible alerts and an automatic gas shut-off mechanism. When a dangerous gas condition is detected, the system can activate the alarm and operate a servo-controlled mechanism to isolate the gas supply.",
    problem: "LPG is widely used for cooking and industrial applications, but an unnoticed gas leak can create a serious fire and safety hazard.\n\nManual detection depends on people noticing the smell of gas and taking action. A delayed response can increase the risk of fire, explosion and property damage.",
    solution: "The system continuously monitors the surrounding environment using a gas sensor.\n\nWhen the detected gas concentration reaches the predefined danger threshold, the microcontroller identifies the condition as a potential LPG leak and activates multiple safety responses.\n\nThe system provides an audible and visual warning while also enabling a servo-controlled mechanism to automatically shut off the gas supply.",
    features: ["Real-time LPG gas monitoring", "Gas leakage detection", "Configurable danger threshold", "Automatic safety response", "Audible buzzer alert", "LED status indication", "OLED status display", "Servo-controlled gas shut-off mechanism", "Embedded microcontroller control", "Continuous environmental monitoring"],
    operation: ["01 \u2014 Gas Monitoring", "The gas sensor continuously monitors the surrounding environment for changes in gas concentration.", "02 \u2014 Threshold Detection", "The microcontroller compares the sensor reading with the predefined safety threshold.", "03 \u2014 Leak Identification", "When the detected level exceeds the threshold, the system identifies a potential gas leakage condition.", "04 \u2014 Warning Activation", "The buzzer and visual indicators are activated to immediately alert people nearby.", "05 \u2014 Automatic Isolation", "The servo mechanism can operate the gas shut-off mechanism to isolate the LPG supply.", "06 \u2014 Status Display", "The OLED provides the current gas-monitoring status and indicates whether the environment is in a safe or alert condition."],
    technologies: ["Gas Sensor", "Microcontroller", "Servo Motor", "OLED", "Buzzer", "LED"],
    applications: ["Residential kitchens", "LPG storage areas", "Restaurants", "Small commercial kitchens", "Laboratories", "Industrial gas-handling areas", "Gas-cylinder monitoring systems", "Automated safety systems"],
    outcome: "A functional prototype was developed that demonstrates the complete safety chain of:\n\nGas Detection \u2192 Threshold Analysis \u2192 Warning \u2192 Automatic Gas Isolation\n\nThe project demonstrates how embedded electronics and automatic actuation can be combined to provide an additional layer of protection against LPG leakage.",
    highlights: ["DETECTIONContinuously monitors the surrounding environment for LPG leakage.", "ALERTProvides immediate audible and visual warning when a dangerous condition is detected.", "DISPLAYShows gas-monitoring status through an OLED interface.", "AUTOMATIC SHUT-OFFServo-controlled mechanism can isolate the LPG supply after leak detection.", "SAFETY AUTOMATIONCombines sensing, decision-making and physical actuation into one system."],
    slug: "automatic-lpg-gas-leak-detection-safety-system",
    image: projectImg_01
  },
  {
    id: "bluetooth-controlled-robotic-arm",
    number: "02",
    title: "Bluetooth-Controlled Robotic Arm",
    filename: "Bluetooth-Controlled Robotic Arm",
    category: "ROBOTICS \u00b7 AUTOMATION",
    categories: ["ALL", "AUTOMATION", "ROBOTICS", "EMBEDDED"],
    shortDescription: "A wireless multi-axis robotic arm that uses Bluetooth commands and servo-driven joints for remote positioning, gripper control and basic pick-and-place operations.",
    overview: "The Bluetooth-Controlled Robotic Arm is a multi-axis robotic manipulation system designed for wireless control of robotic arm movements. The system uses servo motors to control different axes of the arm, including base movement, arm positioning and gripper operation.\n\nA Bluetooth communication interface allows movement commands to be transmitted wirelessly to the embedded controller, which processes the commands and drives the individual servo motors. The prototype demonstrates the fundamentals of wireless robotic control and automated material handling.",
    problem: "Many robotic manipulation systems require wired control interfaces or complex industrial controllers, which can increase system complexity and cost.\n\nFor educational, prototyping and small-scale automation applications, there is a need for a simple and affordable way to control multiple robotic movements wirelessly.",
    solution: "The Bluetooth-Controlled Robotic Arm provides a wireless interface for controlling a multi-axis robotic mechanism.\n\nCommands received through Bluetooth are processed by the microcontroller and converted into servo-motor movements. Each motor controls a specific part of the robotic arm, allowing the operator to position the arm and operate the gripper remotely.",
    features: ["Wireless Bluetooth control", "Multi-axis robotic movement", "Servo motor-based actuation", "Base rotation control", "Arm positioning", "Gripper operation", "Remote movement control", "Embedded microcontroller control", "Pick-and-place capability", "Compact robotic prototype"],
    operation: ["01 \u2014 Wireless Command", "Movement commands are transmitted wirelessly to the robotic arm through the Bluetooth interface.", "02 \u2014 Command Processing", "The embedded controller receives and interprets the incoming commands.", "03 \u2014 Motor Control", "The controller generates the required control signals for the individual servo motors.", "04 \u2014 Arm Movement", "The servo motors move the corresponding robotic joints to the commanded positions.", "05 \u2014 Gripper Control", "The gripper can be opened or closed to hold and release objects.", "06 \u2014 Pick-and-Place", "Coordinated movement of the arm and gripper enables basic object manipulation and pick-and-place operations."],
    technologies: ["Microcontroller", "Bluetooth", "Servo Motors", "Robotic Arm", "Gripper", "Embedded Systems"],
    applications: ["Educational robotics", "Pick-and-place systems", "Small-scale material handling", "Prototype automation", "Laboratory automation", "Robotic manipulation research", "Industrial automation demonstrations"],
    outcome: "A functional multi-axis robotic arm prototype was developed with wireless Bluetooth-based control. The system demonstrates the integration of wireless communication, embedded control, servo actuation and mechanical movement into a compact robotic platform.",
    highlights: ["WIRELESS CONTROLCommands are transmitted to the robotic arm through Bluetooth.", "MULTI-AXIS MOVEMENTMultiple servo-driven joints provide controlled robotic movement.", "GRIPPER CONTROLThe end-effector can open and close for basic object handling.", "EMBEDDED CONTROLThe microcontroller coordinates wireless commands and motor movement.", "PICK & PLACEThe robotic mechanism demonstrates basic object manipulation."],
    slug: "bluetooth-controlled-robotic-arm",
    image: projectImg_02
  },
  {
    id: "smart-medicine-reminder-system",
    number: "03",
    title: "Smart Medicine Reminder System",
    filename: "Smart Medicine Reminder System",
    category: "HEALTHCARE \u00b7 IoT",
    categories: ["ALL", "HEALTHCARE", "EMBEDDED", "IoT"],
    shortDescription: "An automated healthcare-support system that provides scheduled medicine reminders through audible and visual alerts to help users maintain their medication routines.",
    overview: "The Smart Medicine Reminder System is an automated healthcare-support system designed to help users remember and organize their scheduled medication.\n\nThe system provides reminders at predefined medication times and can provide visual and/or audible notifications to indicate when medicine needs to be taken. The prototype demonstrates how embedded electronics and automation can be used to support medication adherence and make routine medicine management more convenient.",
    problem: "People who take medication regularly may sometimes forget or delay their scheduled doses, particularly when multiple medicines or different timings are involved.\n\nFor elderly users, people with busy schedules, or users managing several medications, a dedicated reminder system can provide an additional layer of support and reduce dependence on manually remembering every medication time.",
    solution: "The Smart Medicine Reminder System uses an embedded controller to manage predefined medication schedules.\n\nWhen the programmed medication time is reached, the system activates a reminder through an audible and/or visual indication. The user can then acknowledge the reminder and take the scheduled medicine.\n\nThe system can be further expanded with IoT connectivity for remote notifications and caregiver monitoring.",
    features: ["Scheduled medicine reminders", "Real-time time-based control", "Audible reminder indication", "Visual reminder indication", "Embedded controller", "Simple user interaction", "Medication schedule management", "Expandable IoT connectivity", "User-friendly healthcare-support system"],
    operation: ["01 \u2014 Schedule Setup", "The required medication schedule and reminder times are configured in the system.", "02 \u2014 Time Monitoring", "The controller continuously tracks the current time and compares it with the programmed medication schedule.", "03 \u2014 Reminder Trigger", "When a scheduled medication time is reached, the system activates the reminder.", "04 \u2014 User Notification", "The user receives an audible and/or visual indication that medication is due.", "05 \u2014 Reminder Acknowledgement", "The user can acknowledge the reminder after taking the scheduled medicine.", "06 \u2014 Next Schedule", "The system continues monitoring and waits for the next programmed medication time."],
    technologies: ["Microcontroller", "RTC", "Buzzer", "Display", "LED", "Push Button", "Embedded Systems"],
    applications: ["Home healthcare", "Elderly medication support", "Personal medicine management", "Assisted living environments", "Patient-care applications", "Caregiver-supported medication monitoring", "Smart healthcare systems"],
    outcome: "A functional medication-reminder prototype was developed to demonstrate how embedded automation can assist users in maintaining scheduled medication routines.\n\nThe project provides a foundation that can be extended with mobile notifications, caregiver alerts, medication logging and remote monitoring for a more comprehensive connected healthcare solution.",
    highlights: ["SCHEDULED REMINDERSProvides reminders according to predefined medication timings.", "AUDIBLE & VISUAL ALERTSUses notification mechanisms to make the reminder noticeable.", "AUTOMATED OPERATIONThe system automatically triggers reminders without requiring continuous user monitoring.", "USER SUPPORTDesigned to assist users in maintaining regular medication routines.", "EXPANDABLECan be enhanced with IoT connectivity and remote caregiver notifications."],
    slug: "smart-medicine-reminder-system",
    image: projectImg_03
  },
  {
    id: "smart-flood-detection-early-warning-system",
    number: "04",
    title: "Smart Flood Detection & Early Warning System",
    filename: "Smart Flood Detection & Early Warning System",
    category: "ENVIRONMENT \u00b7 SAFETY \u00b7 IoT",
    categories: ["ALL", "SAFETY", "ENVIRONMENT", "EMBEDDED", "IoT"],
    shortDescription: "A solar-powered multi-sensor flood monitoring system that combines water-level, water-flow and rainfall sensing to detect developing flood conditions and provide early warning.",
    overview: "The Smart Flood Detection & Early Warning System is a solar-powered environmental monitoring platform designed to detect changing flood-related conditions and provide an early warning of potential flooding.\n\nThe system combines water-level monitoring, water-flow sensing and rainfall detection to evaluate changing environmental conditions. By combining multiple parameters instead of relying on a single sensor, the system provides a more comprehensive approach to identifying developing flood conditions.\n\nThe prototype is designed for remote deployment where continuous monitoring and low-power operation are important.",
    problem: "Flooding can develop rapidly due to heavy rainfall, rising water levels and increased water flow. In vulnerable areas, delayed detection can reduce the available time for people to respond and move to safer locations.\n\nConventional monitoring methods may require continuous human observation and may not provide timely warnings in remote or difficult-to-access locations.",
    solution: "The Smart Flood Detection & Early Warning System continuously monitors environmental conditions using multiple sensors.\n\nAn ultrasonic sensor measures water level, a water-flow sensor monitors water movement, and a rain sensor detects rainfall conditions. The controller processes these inputs together to identify potentially dangerous changes.\n\nThe system is powered using a solar panel and battery, allowing it to operate as a self-contained monitoring unit suitable for remote deployment.",
    features: ["Real-time water-level monitoring", "Water-flow monitoring", "Rainfall detection", "Multi-sensor flood assessment", "Early-warning capability", "Solar-powered operation", "Battery-based energy storage", "Autonomous monitoring", "Remote-area deployment capability", "Embedded control system"],
    operation: ["01 \u2014 Rainfall Monitoring", "The rain sensor detects the presence and changing intensity of rainfall conditions.", "02 \u2014 Water-Level Measurement", "The ultrasonic sensor continuously measures the water level and identifies changes in the monitored water body.", "03 \u2014 Water-Flow Monitoring", "The flow sensor monitors the movement of water and provides additional information about changing flow conditions.", "04 \u2014 Data Processing", "The embedded controller collects information from the different sensors and evaluates the combined environmental conditions.", "05 \u2014 Flood Condition Assessment", "When the monitored parameters indicate a potentially dangerous situation, the system can trigger an early-warning response.", "06 \u2014 Autonomous Operation", "The solar panel and battery provide a self-contained power source, allowing the monitoring system to operate without continuous external power."],
    technologies: ["ESP32", "Ultrasonic Sensor", "Water Flow Sensor", "Rain Sensor", "Solar Power", "IoT"],
    applications: ["Flood-prone areas", "Drainage systems", "Rivers and canals", "Low-lying regions", "Agricultural areas", "Urban flood monitoring", "Water-management infrastructure", "Remote environmental monitoring"],
    outcome: "A solar-powered multi-sensor flood-monitoring prototype was developed to demonstrate continuous monitoring of water level, water flow and rainfall.\n\nThe project demonstrates how combining multiple environmental parameters with autonomous power can provide an effective foundation for early flood detection and warning systems.",
    highlights: ["WATER LEVELUltrasonic sensing provides continuous monitoring of changing water levels.", "WATER FLOWFlow sensing provides additional information about water movement.", "RAINFALLRain sensing helps identify environmental conditions associated with potential flooding.", "SOLAR POWERSolar energy and battery storage enable autonomous operation.", "EARLY WARNINGCombining multiple sensor inputs provides a foundation for identifying developing flood conditions before they become critical."],
    slug: "smart-flood-detection-early-warning-system",
    image: projectImg_04
  },
  {
    id: "color-detection-identification-system-using-esp32-cam",
    number: "05",
    title: "Color Detection & Identification System using ESP32-CAM",
    filename: "Color Detection & Identification System using ESP32-CAM",
    category: "COMPUTER VISION \u00b7 AUTOMATION",
    categories: ["ALL", "AUTOMATION", "COMPUTER VISION", "EMBEDDED"],
    shortDescription: "A compact ESP32-CAM vision system that captures objects and identifies their color in real time, with display and LED feedback for automation and inspection applications.",
    overview: "The Color Detection & Identification System using ESP32-CAM is a compact embedded vision system designed to capture an object using a camera and identify its dominant color in real time.\n\nThe ESP32-CAM provides image capture and embedded processing capabilities, while the system provides visual feedback through a display and indicator LEDs. The prototype demonstrates how low-cost computer vision can be integrated into an embedded platform for object identification and automation applications.",
    problem: "Identifying the color of objects manually can become inefficient when objects need to be inspected repeatedly or when color-based decisions need to be automated.\n\nIndustrial and automated systems may require a compact method of identifying objects based on their visual characteristics without relying on expensive vision-processing hardware.",
    solution: "The system uses an ESP32-CAM to capture images of objects and process the visual information to determine the detected color.\n\nOnce the color is identified, the system provides corresponding visual feedback through the display and indicator LEDs. This creates a compact platform that can be further integrated into automated sorting, inspection and classification systems.",
    features: ["ESP32-CAM based image capture", "Real-time color identification", "Embedded image processing", "Object color classification", "Display-based status information", "RGB/status LED indication", "Compact vision system", "Low-cost embedded computer vision", "Expandable automation platform"],
    operation: ["01 \u2014 Image Capture", "The ESP32-CAM camera captures an image of the object placed within the detection area.", "02 \u2014 Image Processing", "The captured visual information is processed by the embedded system.", "03 \u2014 Color Identification", "The system analyzes the relevant color information and determines the detected object color.", "04 \u2014 Result Display", "The identified color or system status is presented through the connected display.", "05 \u2014 Visual Indication", "Indicator LEDs provide an additional visual representation of the detection result."],
    technologies: ["ESP32-CAM", "Camera", "Image Processing", "Display", "RGB LEDs", "Embedded Systems"],
    applications: ["Automated object sorting", "Manufacturing inspection", "Color-based classification", "Educational computer vision", "Small-scale automation", "Quality inspection", "Object identification", "Smart manufacturing prototypes"],
    outcome: "A compact embedded computer-vision prototype was developed using the ESP32-CAM to demonstrate real-time object color identification.\n\nThe project demonstrates the integration of camera-based sensing, image processing, embedded computing and visual feedback within a low-cost platform suitable for future automation and inspection applications.",
    highlights: ["VISIONUses an ESP32-CAM for image-based object detection.", "COLOR IDENTIFICATIONAnalyzes captured visual information to determine object color.", "EMBEDDED PROCESSINGPerforms the detection process within a compact embedded platform.", "VISUAL FEEDBACKDisplays detection information and provides LED-based status indication.", "AUTOMATION READYCan serve as a foundation for color-based sorting and inspection systems."],
    slug: "color-detection-identification-system-using-esp32-cam",
    image: projectImg_05
  },
  {
    id: "automatic-fire-fighting-system",
    number: "06",
    title: "Automatic Fire Fighting System",
    filename: "Automatic Fire Fighting System",
    category: "SAFETY \u00b7 AUTOMATION",
    categories: ["ALL", "SAFETY", "AUTOMATION", "EMBEDDED"],
    shortDescription: "An automated fire detection and suppression system that identifies fire conditions and activates a water-based firefighting mechanism for rapid first-response safety.",
    overview: "The Automatic Fire Fighting System is an embedded safety system designed to detect the presence of fire and automatically initiate a fire suppression response. The system continuously monitors the surrounding area for fire conditions and, when a fire is detected, activates the connected firefighting mechanism without requiring manual intervention.\n\nThe prototype combines fire detection, embedded control, automatic actuation and a water-based suppression mechanism into a compact system. This demonstrates how automated safety systems can provide a rapid first response to fire incidents.",
    problem: "Fire incidents can spread rapidly, especially when they are not detected immediately. Conventional firefighting methods often depend on a person noticing the fire and manually activating a response system.\n\nA delay between fire detection and response can increase the risk of equipment damage, property loss and safety hazards.",
    solution: "The Automatic Fire Fighting System provides an automated first-response mechanism.\n\nThe system continuously monitors for fire using a fire-detection sensor. When the detected condition exceeds the defined threshold, the microcontroller processes the input and activates the firefighting mechanism.\n\nThis allows the system to respond automatically to a detected fire condition and demonstrate rapid localized fire suppression.",
    features: ["Automatic fire detection", "Real-time monitoring", "Automatic firefighting response", "Sensor-based control", "Water-based fire suppression", "Embedded microcontroller control", "Automated activation mechanism", "Compact prototype design", "Reduced dependence on manual intervention"],
    operation: ["01 \u2014 Fire Detection", "The sensing unit continuously monitors the surrounding area for the presence of fire.", "02 \u2014 Signal Processing", "The microcontroller receives the sensor signal and determines whether the detected condition represents a fire event.", "03 \u2014 Automatic Activation", "When fire is detected, the controller activates the connected firefighting mechanism.", "04 \u2014 Fire Suppression", "The suppression mechanism delivers water toward the affected area to demonstrate automatic fire extinguishing.", "05 \u2014 Continuous Monitoring", "The system continues monitoring the environment so that it can respond to subsequent fire conditions."],
    technologies: ["Fire Sensor", "Microcontroller", "Water Pump", "Automation", "Embedded Systems"],
    applications: ["Small industrial workspaces", "Laboratories", "Workshops", "Electrical/electronic work areas", "Storage areas", "Small machinery enclosures", "Educational safety systems", "Automated fire-response prototypes"],
    outcome: "A functional prototype was developed to demonstrate the complete chain of fire detection \u2192 decision processing \u2192 automatic actuation \u2192 fire suppression.\n\nThe project demonstrates how embedded systems and automation can be combined to create a faster and more autonomous response to fire-related safety events.",
    highlights: ["DETECTIONContinuous monitoring for fire conditions.", "AUTOMATIONAutomatic response without requiring immediate manual activation.", "SUPPRESSIONWater-based mechanism activated after fire detection.", "EMBEDDED CONTROLMicrocontroller-based decision and control system."],
    slug: "automatic-fire-fighting-system",
    image: projectImg_06
  },
  {
    id: "automatic-home-automation-system",
    number: "07",
    title: "Automatic Home Automation System",
    filename: "Automatic Home Automation System",
    category: "HOME AUTOMATION \u00b7 IoT",
    categories: ["ALL", "AUTOMATION", "EMBEDDED", "IoT"],
    shortDescription: "An embedded home automation platform that enables automatic control of household electrical appliances using sensors, intelligent control logic and switching technology.",
    overview: "The Automatic Home Automation System is a smart control system designed to automate common household electrical appliances and devices. The system combines sensors, embedded control and switching mechanisms to provide automatic control of connected appliances based on the surrounding conditions or user requirements.\n\nThe prototype demonstrates how conventional household devices can be integrated into a centralized automation system, reducing the need for manual operation while improving convenience and energy management.",
    problem: "Traditional household appliances often require manual operation. Lights, fans and other electrical devices may remain switched on even when they are not required, resulting in unnecessary energy consumption.\n\nManaging multiple appliances manually can also become inconvenient, particularly when users need to control several devices simultaneously.",
    solution: "The Automatic Home Automation System provides an embedded control platform for managing household appliances.\n\nSensors and control inputs are processed by the controller, which operates the connected electrical loads through appropriate switching circuitry. This enables appliances to be controlled automatically according to predefined conditions or user commands.\n\nThe system demonstrates the foundation of a scalable smart-home environment.",
    features: ["Automated appliance control", "Sensor-based operation", "Centralized device control", "Automatic switching of electrical loads", "Embedded controller-based operation", "Real-time system response", "Reduced manual intervention", "Expandable architecture for additional appliances", "Potential for improved energy management"],
    operation: ["01 \u2014 Input Detection", "Sensors or user control inputs provide information about the required operating condition.", "02 \u2014 Embedded Processing", "The controller receives and processes the input signals according to the programmed control logic.", "03 \u2014 Appliance Control", "The controller operates the connected switching circuit to turn appliances ON or OFF.", "04 \u2014 Automatic Operation", "The appliances respond automatically according to the programmed conditions.", "05 \u2014 Continuous Monitoring", "The system continuously monitors the inputs and updates appliance states when the required conditions change."],
    technologies: ["Microcontroller", "Sensors", "Relay Control", "Electrical Loads", "Embedded Systems"],
    applications: ["Residential homes", "Smart rooms", "Offices", "Classrooms", "Laboratories", "Small commercial spaces", "Energy-management systems", "Smart-building applications"],
    outcome: "A functional home-automation prototype was developed to demonstrate automatic control of electrical appliances using embedded control and switching technology.\n\nThe project demonstrates the integration of sensing \u2192 decision making \u2192 switching \u2192 appliance control within a compact smart-home platform.",
    highlights: ["AUTOMATION", "Automates common household appliance operations.", "CONTROL", "Provides centralized control of connected electrical loads.", "SENSING", "Uses input conditions to determine appliance operation.", "SCALABILITY", "Can be expanded to support additional appliances and smart-home functions."],
    slug: "automatic-home-automation-system",
    image: projectImg_07
  },
  {
    id: "chill-chain-smart-milk-quality-vendor-tracking-system",
    number: "08",
    title: "Chill Chain \u2013 Smart Milk Quality & Vendor Tracking System",
    filename: "Chill Chain \u2013 Smart Milk Quality & Vendor Tracking System",
    category: "FOOD & SUPPLY CHAIN \u00b7 IoT",
    categories: ["ALL", "FOOD & SUPPLY CHAIN", "EMBEDDED", "IoT"],
    shortDescription: "An IoT-based milk collection platform that combines milk quality monitoring with RFID-based vendor identification to improve traceability, accountability and quality control.",
    overview: "Chill Chain \u2013 Smart Milk Quality & Vendor Tracking System is an IoT-based milk collection and traceability platform designed to combine milk quality monitoring with vendor identification.\n\nThe system uses sensors to evaluate milk quality parameters during collection while an RFID system uniquely identifies each milk-selling person or vendor. The collected information can be associated with the corresponding vendor, creating a more transparent and traceable milk collection process.\n\nBy connecting physical quality measurements with digital vendor identification, the system provides a foundation for improved quality control, accountability and supply-chain management.",
    problem: "Milk collection involves multiple suppliers and collection points, making it important to maintain reliable information about both milk quality and its source.\n\nWhen quality measurements and supplier information are maintained separately or manually, it can become difficult to identify the source of a particular milk sample, maintain consistent records and improve accountability throughout the collection process.",
    solution: "Chill Chain integrates milk quality sensing and RFID-based vendor identification into a single monitoring platform.\n\nEach milk-selling person or vendor can be identified using an RFID tag. During the collection process, the system measures the available milk-quality parameters and associates the measurement with the identified vendor.\n\nThis creates a digital traceability approach in which vendor identity + quality information can be linked together.",
    features: ["Milk quality monitoring", "RFID-based vendor identification", "Unique vendor identification", "Quality-data association", "Real-time sensor monitoring", "Embedded processing", "OLED/local display", "Digital traceability", "Improved collection transparency", "Expandable IoT architecture"],
    operation: ["01 \u2014 Vendor Identification", "The vendor presents their assigned RFID tag to the RFID reader.", "02 \u2014 Vendor Verification", "The system reads the RFID information and identifies the corresponding milk-selling person.", "03 \u2014 Milk Quality Measurement", "The connected sensors measure the available milk-quality parameters.", "04 \u2014 Data Association", "The quality measurements are associated with the identified vendor.", "05 \u2014 Local Display", "The system provides relevant information through the display for immediate observation.", "06 \u2014 Digital Traceability", "The collected information can be stored digitally, creating a traceable record for quality-control and supply-chain purposes."],
    technologies: ["ESP32", "RFID RC522", "Milk Quality Sensors", "OLED", "IoT", "Data Logging"],
    applications: ["Dairy milk collection centers", "Milk procurement systems", "Dairy supply chains", "Vendor quality tracking", "Agricultural cooperatives", "Food-quality monitoring", "Supplier traceability systems", "Digital dairy management"],
    outcome: "A functional prototype was developed to demonstrate how RFID-based vendor identification and milk-quality monitoring can be integrated into a single digital collection system.\n\nThe project demonstrates a practical approach to improving traceability, quality monitoring and accountability in milk collection and dairy supply chains.",
    highlights: ["VENDOR IDENTIFICATIONRFID provides a unique identity for each participating milk vendor.", "QUALITY MONITORINGSensors are used to evaluate relevant milk-quality parameters during collection.", "TRACEABILITYVendor identity can be linked with the corresponding quality measurement.", "DIGITAL COLLECTIONThe system provides a foundation for moving from manual records toward digitally traceable collection.", "IoT ARCHITECTUREThe platform can be expanded for centralized data storage and remote monitoring."],
    slug: "chill-chain-smart-milk-quality-vendor-tracking-system",
    image: projectImg_08
  },
  {
    id: "smart-air-quality-multi-gas-monitoring-system",
    number: "09",
    title: "Smart air quality & multi-gas monitoring system",
    filename: "Smart air quality & multi-gas monitoring system",
    category: "ENVIRONMENT \u00b7 SAFETY \u00b7 IoT",
    categories: ["ALL", "SAFETY", "ENVIRONMENT", "EMBEDDED", "IoT"],
    shortDescription: "A real-time environmental monitoring platform that combines multi-gas and air-quality sensing with embedded processing for safety and environmental monitoring applications.",
    overview: "The Smart Air Quality & Multi-Gas Monitoring System is a real-time environmental monitoring platform designed to monitor surrounding air conditions and detect the presence of multiple gases.\n\nThe system combines gas and environmental sensing with embedded processing to continuously evaluate the surrounding atmosphere. Sensor readings can be monitored locally and used to identify abnormal conditions, providing an additional layer of awareness for environments where air quality and gas presence are important safety considerations.",
    problem: "Poor air quality and the accumulation of unwanted gases can create unhealthy or unsafe conditions in enclosed spaces, laboratories, workshops and industrial environments.\n\nWithout continuous monitoring, changes in environmental conditions may go unnoticed until they become a significant concern.",
    solution: "The system provides continuous monitoring of air-quality and gas-related parameters through multiple sensing elements.\n\nThe embedded controller processes the sensor readings and provides a real-time indication of the detected environmental conditions. The modular design also allows additional sensors or monitoring functions to be integrated as required.",
    features: ["Real-time air-quality monitoring", "Multi-gas sensing", "Continuous environmental monitoring", "Embedded sensor processing", "Abnormal-condition detection", "Local status indication", "Modular sensor architecture", "Compact monitoring system", "Expandable IoT platform"],
    operation: ["01 \u2014 Environmental Sensing", "The connected sensors continuously monitor the surrounding environment.", "02 \u2014 Data Acquisition", "Sensor outputs are collected by the embedded controller.", "03 \u2014 Data Processing", "The controller processes the incoming sensor values and evaluates the current environmental condition.", "04 \u2014 Status Monitoring", "The measured conditions are presented through the system interface for real-time observation.", "05 \u2014 Alert Capability", "When configured thresholds are exceeded, the system can be extended to provide warning indications or remote notifications."],
    technologies: ["Gas Sensors", "Air Quality Sensors", "Microcontroller", "IoT", "Embedded Systems"],
    applications: ["Indoor air-quality monitoring", "Industrial workspaces", "Laboratories", "Workshops", "Smart buildings", "Storage areas", "Environmental monitoring stations", "Safety-monitoring systems"],
    outcome: "A compact multi-sensor monitoring prototype was developed to demonstrate continuous observation of air-quality and gas-related environmental conditions.\n\nThe project demonstrates how embedded sensing, real-time data processing and IoT-ready architecture can be combined to create an expandable environmental monitoring platform.",
    highlights: ["MULTI-GAS MONITORINGMonitors multiple gas-related conditions through an expandable sensor platform.", "AIR QUALITYProvides continuous awareness of surrounding environmental conditions.", "REAL-TIME PROCESSINGSensor information is continuously acquired and processed by the embedded controller.", "SAFETYCan be configured to identify abnormal environmental conditions.", "EXPANDABLEThe architecture can be extended with additional sensors, alerts and remote monitoring."],
    slug: "smart-air-quality-multi-gas-monitoring-system",
    image: projectImg_09
  },
  {
    id: "smart-automatic-clothes-collector-system",
    number: "10",
    title: "Smart automatic clothes collector system",
    filename: "Smart automatic clothes collector system",
    category: "SMART HOME \u00b7 AUTOMATION",
    categories: ["ALL", "AUTOMATION", "EMBEDDED"],
    shortDescription: "A smart household automation system that detects changing environmental conditions and automatically moves clothes to a protected position, reducing manual intervention.",
    overview: "The Smart Automatic Clothes Collector System is an automated household solution designed to detect environmental conditions and automatically move clothes to a protected position when required.\n\nThe system combines environmental sensing with an automated mechanical movement mechanism. When the monitored condition indicates that clothes need to be protected, the controller activates the mechanism to move the clothes into a safer or covered position.\n\nThe prototype demonstrates how sensing, embedded control and mechanical automation can be combined to create a practical smart-home solution.",
    problem: "Clothes left outdoors can be exposed to changing weather conditions such as rain. Manually collecting clothes requires constant attention and can become inconvenient when the user is away from home.\n\nA system that can automatically detect changing environmental conditions and respond by protecting the clothes can reduce manual intervention.",
    solution: "The Smart Automatic Clothes Collector uses environmental sensing to monitor surrounding conditions.\n\nWhen the system detects a condition requiring clothes to be collected, the embedded controller activates the motorized mechanism. The mechanism automatically moves the clothes toward a protected position.\n\nThis provides an automated approach to everyday household clothes management.",
    features: ["Automatic environmental-condition detection", "Automatic clothes collection", "Sensor-based control", "Motorized mechanical movement", "Embedded controller", "Reduced manual intervention", "Smart-home automation", "Practical household application", "Expandable control architecture"],
    operation: ["01 \u2014 Environmental Monitoring", "The sensing system continuously monitors the surrounding environmental condition.", "02 \u2014 Condition Detection", "The controller evaluates the sensor input to determine whether the clothes need to be collected.", "03 \u2014 Automatic Decision", "When the predefined condition is detected, the controller initiates the collection process.", "04 \u2014 Mechanical Activation", "The motorized mechanism moves the clothes toward the designated protected position.", "05 \u2014 Protection", "The clothes are moved away from the exposed area, reducing the possibility of damage from the detected environmental condition."],
    technologies: ["Environmental Sensor", "Microcontroller", "Motor", "Mechanical System", "Automation"],
    applications: ["Residential clothes-drying areas", "Rooftop clotheslines", "Balconies", "Smart homes", "Automated household systems", "Weather-responsive home automation", "Outdoor drying systems"],
    outcome: "A working automation concept was developed to demonstrate how environmental sensing can trigger an automatic mechanical response for a practical household task.\n\nThe project combines sensing \u2192 decision making \u2192 motor control \u2192 mechanical movement into a compact smart-home automation solution.",
    highlights: ["AUTOMATIC DETECTION", "Monitors environmental conditions continuously.", "SMART RESPONSE", "Automatically initiates the collection process when the required condition is detected.", "MECHANICAL AUTOMATION", "Uses a motor-driven mechanism to move the clothes.", "CONVENIENCE", "Reduces the need for constant manual monitoring.", "SMART HOME READY", "Can be extended with remote monitoring and IoT control."],
    slug: "smart-automatic-clothes-collector-system",
    image: projectImg_10
  },
  {
    id: "smart-energy-monitoring-automatic-lighting",
    number: "11",
    title: "Smart energy monitoring & automatic lighting",
    filename: "Smart energy monitoring & automatic lighting",
    category: "ENERGY \u00b7 AUTOMATION",
    categories: ["ALL", "AUTOMATION", "ENERGY", "EMBEDDED"],
    shortDescription: "A smart energy-management system that monitors electrical usage and automatically controls lighting to improve energy awareness and reduce unnecessary consumption.",
    overview: "The Smart Energy Monitoring & Automatic Lighting System is an embedded automation platform designed to monitor electrical energy usage while automatically controlling lighting based on the required operating conditions.\n\nThe system combines energy monitoring with automatic lighting control to provide greater visibility into electrical consumption and reduce unnecessary operation of lighting loads. It demonstrates how sensing, embedded processing and automated switching can be integrated into a practical energy-management solution.",
    problem: "Unnecessary operation of electrical lighting can lead to avoidable energy consumption. In conventional environments, lights may remain switched on even when they are not required, while users may have limited visibility into how much energy is being consumed.\n\nA system that combines energy monitoring with automatic lighting control can help improve awareness and reduce unnecessary usage.",
    solution: "The Smart Energy Monitoring & Automatic Lighting system continuously monitors relevant electrical parameters and provides information about energy usage.\n\nAt the same time, the lighting system can be automatically controlled based on predefined conditions. The controller processes sensor information and operates the connected lighting load through an appropriate switching mechanism.\n\nThis creates a combined monitoring + automation platform for smarter energy management.",
    features: ["Real-time energy monitoring", "Automatic lighting control", "Electrical parameter sensing", "Embedded data processing", "Automated switching", "Reduced unnecessary lighting operation", "Energy-usage awareness", "Expandable IoT architecture", "Smart-building application"],
    operation: ["01 \u2014 Energy Sensing", "The system measures relevant electrical parameters from the connected load.", "02 \u2014 Data Processing", "The embedded controller collects and processes the measured information.", "03 \u2014 Energy Monitoring", "The system provides information about the monitored electrical consumption for observation and analysis.", "04 \u2014 Condition Detection", "The controller evaluates the programmed conditions for automatic lighting operation.", "05 \u2014 Automatic Lighting Control", "The switching mechanism controls the connected lighting load according to the required condition.", "06 \u2014 Continuous Operation", "The system continues monitoring and controlling the lighting system in real time."],
    technologies: ["Energy Sensor", "Microcontroller", "Light Sensor", "Relay", "IoT", "Embedded Systems"],
    applications: ["Smart homes", "Offices", "Classrooms", "Laboratories", "Commercial buildings", "Energy-management systems", "Smart-building infrastructure", "Automated lighting systems"],
    outcome: "A functional prototype was developed to demonstrate the integration of energy monitoring and automatic lighting control within a single embedded platform.\n\nThe project demonstrates how real-time electrical monitoring can be combined with automated load control to create a practical foundation for energy-efficient smart environments.",
    highlights: ["ENERGY MONITORINGProvides real-time visibility into electrical usage.", "AUTOMATIC LIGHTINGControls lighting loads based on programmed conditions.", "SMART CONTROLCombines sensing and embedded decision-making.", "ENERGY AWARENESSHelps identify unnecessary lighting operation and energy usage.", "SCALABLECan be extended with additional loads, sensors and remote monitoring."],
    slug: "smart-energy-monitoring-automatic-lighting",
    image: projectImg_11
  },
  {
    id: "smart-irrigation-system",
    number: "12",
    title: "Smart Irrigation System",
    filename: "Smart Irrigation System",
    category: "AGRICULTURE \u00b7 IoT \u00b7 AUTOMATION",
    categories: ["ALL", "AUTOMATION", "AGRICULTURE", "EMBEDDED", "IoT"],
    shortDescription: "An automated irrigation system that monitors soil moisture and intelligently controls water supply to plants based on their actual watering requirements.",
    overview: "The Smart Irrigation System is an automated agricultural monitoring and irrigation solution designed to provide water to plants based on soil moisture conditions.\n\nThe system continuously monitors the moisture level of the soil and uses the measured condition to determine when irrigation is required. By automating the watering process, the system can help reduce unnecessary water usage while maintaining suitable moisture conditions for plant growth.",
    problem: "Traditional irrigation methods often depend on manual watering or fixed schedules. This can result in plants receiving too much or too little water, particularly when environmental conditions change.\n\nManual irrigation also requires regular human attention and can lead to unnecessary water consumption.",
    solution: "The Smart Irrigation System uses a soil-moisture sensor to continuously monitor the condition of the soil.\n\nWhen the soil becomes sufficiently dry, the controller activates the irrigation mechanism to supply water to the plants. Once the required moisture condition is reached, the irrigation mechanism can be stopped.\n\nThis creates an automated watering cycle based on the actual condition of the soil rather than a fixed schedule.",
    features: ["Real-time soil-moisture monitoring", "Automatic irrigation", "Soil-condition-based watering", "Water-pump control", "Embedded automation", "Reduced manual intervention", "Improved water-management potential", "Continuous monitoring", "Expandable smart-agriculture platform"],
    operation: ["01 \u2014 Soil Monitoring", "The soil-moisture sensor continuously measures the moisture condition of the soil.", "02 \u2014 Data Processing", "The microcontroller reads and processes the moisture value.", "03 \u2014 Moisture Assessment", "The measured value is compared with the programmed moisture threshold.", "04 \u2014 Automatic Irrigation", "When the soil is detected to be too dry, the controller activates the water-pumping mechanism.", "05 \u2014 Moisture Recovery", "Water is supplied to the plants until the desired moisture condition is reached.", "06 \u2014 Automatic Stop", "Once sufficient moisture is detected, the irrigation mechanism is switched off."],
    technologies: ["Soil Moisture Sensor", "Microcontroller", "Water Pump", "Relay", "Embedded Systems"],
    applications: ["Home gardens", "Agricultural fields", "Greenhouses", "Nursery plants", "Terrace gardens", "Small-scale farming", "Smart agriculture", "Automated plant-care systems"],
    outcome: "A functional automated irrigation prototype was developed to demonstrate soil-condition-based watering.\n\nThe project combines sensing, embedded decision-making and automatic pump control to create a practical smart-agriculture solution that can reduce manual watering and improve water-management efficiency.",
    highlights: ["SOIL SENSINGContinuously monitors soil moisture conditions.", "AUTOMATIC WATERINGActivates irrigation when the soil requires additional water.", "WATER MANAGEMENTHelps avoid unnecessary watering by responding to actual soil conditions.", "EMBEDDED CONTROLUses programmed control logic to automate the irrigation process.", "SMART AGRICULTUREProvides a foundation for larger automated farming and plant-monitoring systems."],
    slug: "smart-irrigation-system",
    image: projectImg_12
  },
  {
    id: "smart-parking-management-system",
    number: "13",
    title: "Smart Parking Management System",
    filename: "Smart Parking Management System",
    category: "MOBILITY \u00b7 AUTOMATION \u00b7 IoT",
    categories: ["ALL", "AUTOMATION", "MOBILITY", "EMBEDDED", "IoT"],
    shortDescription: "An automated parking solution that detects available spaces, displays real-time parking status and controls vehicle access through an automated entry barrier.",
    overview: "The Smart Parking Management System is an automated parking solution designed to monitor parking-space availability and simplify vehicle entry and access management.\n\nThe system uses sensors to detect whether individual parking spaces are occupied or available. The current parking status is displayed to users, while an automated barrier mechanism can control vehicle entry and exit.\n\nThe prototype demonstrates how embedded sensing and automation can be combined to create a more efficient parking-management solution.",
    problem: "Finding available parking spaces can be time-consuming, particularly in locations with multiple parking bays.\n\nTraditional parking systems may require drivers or security personnel to manually identify available spaces and manage entry. This can result in unnecessary waiting, congestion and inefficient use of parking capacity.",
    solution: "The Smart Parking Management System continuously monitors individual parking spaces using sensors.\n\nWhen a vehicle occupies a parking bay, the corresponding sensor detects the change in status. The system updates the parking information and provides an indication of available and occupied spaces.\n\nAn automated servo-controlled barrier can also manage vehicle entry and exit, creating a more organized parking process.",
    features: ["Real-time parking-slot detection", "Individual slot occupancy monitoring", "Available/occupied status indication", "Automatic entry barrier", "Servo-controlled gate mechanism", "Display-based parking information", "LED status indicators", "Embedded control", "Automated parking management", "Expandable smart-mobility platform"],
    operation: ["01 \u2014 Vehicle Detection", "Sensors positioned at the parking spaces detect whether a vehicle is present.", "02 \u2014 Slot Status Processing", "The embedded controller processes the sensor information and determines which spaces are occupied or available.", "03 \u2014 Parking Status Display", "The system updates the available parking information through the display and status indicators.", "04 \u2014 Entry Management", "The automated barrier can control vehicle access based on the parking availability.", "05 \u2014 Vehicle Parking", "When a vehicle occupies a slot, the system updates that slot as occupied.", "06 \u2014 Continuous Monitoring", "The system continuously monitors the parking area and updates the status as vehicles enter or leave."],
    technologies: ["Microcontroller", "Parking Sensors", "Servo Motor", "OLED", "LEDs", "Embedded Systems"],
    applications: ["Shopping malls", "Office parking areas", "College campuses", "Residential communities", "Hospitals", "Hotels", "Commercial buildings", "Smart-city parking infrastructure"],
    outcome: "A functional smart parking prototype was developed to demonstrate automated parking-space detection, availability indication and entry-barrier control.\n\nThe system provides a foundation that can be expanded into a larger connected parking platform with mobile applications, centralized monitoring, reservation systems and cloud-based analytics.",
    highlights: ["SLOT DETECTIONContinuously identifies occupied and available parking spaces.", "LIVE STATUSProvides an immediate indication of parking availability.", "AUTOMATIC BARRIERUses a servo-controlled mechanism to manage vehicle access.", "VISUAL INDICATIONLEDs and display provide easy-to-understand parking information.", "SMART MOBILITYProvides a foundation for connected and automated parking infrastructure."],
    slug: "smart-parking-management-system",
    image: projectImg_13
  },
  {
    id: "smart-patient-bed-fall-detection-alert-system",
    number: "14",
    title: "Smart Patient Bed Fall Detection & Alert System",
    filename: "Smart Patient Bed Fall Detection & Alert System",
    category: "HEALTHCARE \u00b7 IoT \u00b7 SAFETY",
    categories: ["ALL", "SAFETY", "HEALTHCARE", "EMBEDDED", "IoT"],
    shortDescription: "An IoT-enabled patient safety system that monitors bed conditions, detects potential falls and sends real-time alerts through Telegram, email and a centralized monitoring dashboard.",
    overview: "The Smart Patient Bed Fall Detection & Alert System is an IoT-enabled healthcare safety system designed to monitor patients while they are in bed and identify situations that may indicate a potential fall or unsafe movement.\n\nThe system uses sensors and an embedded controller to monitor the patient's bed condition. When an abnormal movement or potential fall condition is detected, the system can generate an immediate alert and communicate the event remotely through connected notification services.\n\nA centralized dashboard can also be used to provide a live view of the patient's monitoring status and system information.",
    problem: "Patients who are elderly, physically weak, recovering from illness or requiring continuous supervision may be at risk of falling from a bed.\n\nContinuous manual monitoring by caregivers can be difficult, particularly in hospitals and care environments where multiple patients may need attention simultaneously.\n\nA delayed response to a patient fall can increase the risk of injury and complications.",
    solution: "The Smart Patient Bed Fall Detection & Alert System continuously monitors the patient's bed using sensors connected to an embedded controller.\n\nWhen the system identifies a condition associated with a potential fall or unsafe movement, it generates an alert. The system can communicate the event remotely through Telegram and email notifications, allowing caregivers or authorized personnel to respond more quickly.\n\nA centralized web dashboard provides an additional interface for viewing the patient's current monitoring status and system information.",
    features: ["Patient bed monitoring", "Fall/unsafe-movement detection", "Real-time monitoring", "Immediate alert generation", "Telegram notifications", "Email notifications", "Centralized web dashboard", "Embedded controller", "Remote monitoring capability", "Continuous patient-safety monitoring"],
    operation: ["01 \u2014 Bed Monitoring", "Sensors continuously monitor the patient's position and the condition of the bed.", "02 \u2014 Sensor Data Processing", "The embedded controller collects and processes the sensor information.", "03 \u2014 Abnormal Condition Detection", "The system evaluates the sensor readings to identify a potential fall or abnormal bed movement.", "04 \u2014 Alert Generation", "When a potentially unsafe condition is detected, the system generates an alert.", "05 \u2014 Remote Notification", "The alert can be transmitted through connected communication services such as Telegram and email.", "06 \u2014 Dashboard Monitoring", "The centralized dashboard provides caregivers with real-time system and patient-status information."],
    technologies: ["Sensors", "ESP32", "IoT", "Telegram API", "Email", "Web Dashboard"],
    applications: ["Hospitals", "Elderly-care facilities", "Nursing homes", "Home healthcare", "Patient recovery environments", "Assisted-living facilities", "Remote patient monitoring"],
    outcome: "A functional IoT-based patient-safety prototype was developed to demonstrate continuous bed monitoring, abnormal-condition detection and remote alert generation.\n\nThe system demonstrates how embedded sensing, IoT communication and web-based monitoring can be integrated to provide an additional layer of support for patient safety and caregiver awareness.",
    highlights: ["PATIENT MONITORINGContinuously monitors the patient's bed condition.", "FALL DETECTIONIdentifies sensor conditions associated with potential falls or unsafe movement.", "REMOTE ALERTSSends notifications through Telegram and email.", "LIVE DASHBOARDProvides centralized visibility into the monitoring system.", "IoT HEALTHCAREConnects physical patient monitoring with remote digital communication."],
    slug: "smart-patient-bed-fall-detection-alert-system",
    image: projectImg_14
  },
  {
    id: "sound-reactive-led-system",
    number: "15",
    title: "Sound Reactive LED System",
    filename: "Sound Reactive LED System",
    category: "EMBEDDED \u00b7 INTERACTIVE ELECTRONICS",
    categories: ["ALL", "EMBEDDED"],
    shortDescription: "A real-time interactive lighting system that detects surrounding sound, displays sound intensity on an OLED and dynamically controls LED output according to audio activity.",
    overview: "The Sound Reactive LED System is an interactive embedded lighting system that responds to surrounding sound in real time.\n\nThe system captures sound intensity through a microphone/sound sensor and processes the signal using a microcontroller. The detected sound level is displayed through an OLED interface while connected LED modules dynamically respond to changes in the detected audio level.\n\nThe project demonstrates how sound sensing, embedded signal processing and responsive lighting can be combined to create an interactive electronic system.",
    problem: "Conventional lighting systems generally operate independently of the surrounding environment and do not respond dynamically to user activity or ambient sound.\n\nInteractive environments, entertainment systems and smart lighting applications can benefit from lighting that reacts automatically to changes in sound intensity.",
    solution: "The Sound Reactive LED System continuously monitors surrounding sound using a microphone/sound sensor.\n\nThe microcontroller processes the sensor signal and determines the corresponding sound intensity. The measured level is displayed on an OLED, while the connected LED modules dynamically change their response according to the detected sound level.\n\nThis creates a real-time relationship between sound input and visual lighting output.",
    features: ["Real-time sound detection", "Sound-intensity monitoring", "Dynamic LED response", "OLED sound-level display", "Microcontroller-based processing", "Interactive lighting", "Real-time sensor response", "Modular LED architecture", "Compact embedded design"],
    operation: ["01 \u2014 Sound Detection", "The microphone/sound sensor continuously captures surrounding audio activity.", "02 \u2014 Signal Processing", "The microcontroller receives the sensor output and processes the detected sound level.", "03 \u2014 Sound-Level Calculation", "The system determines the relative intensity of the detected sound.", "04 \u2014 OLED Display", "The current sound level is presented through the OLED display for real-time observation.", "05 \u2014 LED Response", "The connected LED modules respond dynamically according to the detected sound intensity.", "06 \u2014 Continuous Interaction", "The system continuously updates the lighting response as the surrounding sound changes."],
    technologies: ["Arduino", "Sound Sensor", "OLED", "LED Modules", "Embedded C", "C++"],
    applications: ["Interactive lighting", "Entertainment systems", "Music-responsive lighting", "Events and installations", "Smart-room environments", "Educational electronics", "Audio visualization", "Interactive art installations"],
    outcome: "A functional sound-responsive lighting prototype was developed that demonstrates real-time conversion of audio activity into a visual lighting response.\n\nThe project combines sensing, embedded signal processing, display technology and LED control to create an interactive electronic experience.",
    highlights: ["SOUND SENSINGDetects surrounding sound activity in real time.", "SIGNAL PROCESSINGProcesses microphone input using an embedded controller.", "OLED MONITORINGDisplays the detected sound level for real-time observation.", "DYNAMIC LIGHTINGLED output changes according to the detected sound intensity.", "INTERACTIVE SYSTEMCreates a direct relationship between environmental sound and visual output."],
    slug: "sound-reactive-led-system",
    image: projectImg_15
  },
  {
    id: "temperature-monitoring-sms-alert-system",
    number: "16",
    title: "Temperature Monitoring & SMS Alert System",
    filename: "Temperature Monitoring & SMS Alert System",
    category: "SAFETY \u00b7 IoT \u00b7 EMBEDDED",
    categories: ["ALL", "SAFETY", "EMBEDDED", "IoT"],
    shortDescription: "A real-time temperature safety system that detects abnormal temperature conditions and automatically sends SMS alerts through GSM while providing local warning indications.",
    overview: "The Temperature Monitoring & SMS Alert System is a real-time temperature monitoring and safety system designed to continuously measure temperature and provide an immediate notification when the measured temperature exceeds a predefined threshold.\n\nThe system combines temperature sensing, embedded processing, local status indication and GSM-based communication. When an abnormal temperature condition is detected, the system can automatically send an SMS alert to a registered mobile number, allowing the condition to be identified even when the user is not physically present at the monitoring location.",
    problem: "Excessive temperature can indicate overheating or abnormal operating conditions in equipment, storage areas and other temperature-sensitive environments.\n\nIf temperature is not continuously monitored, an abnormal rise may remain unnoticed until it causes equipment damage, product loss or a safety issue.",
    solution: "The system continuously measures the surrounding temperature using a temperature sensor.\n\nThe microcontroller processes the measured value and compares it against a predefined temperature threshold. When the temperature exceeds the configured limit, the system activates a local warning and uses a GSM module to automatically send an SMS alert to a registered mobile number.\n\nThis provides both local indication and remote notification of abnormal temperature conditions.",
    features: ["Real-time temperature monitoring", "Continuous sensor measurement", "Configurable temperature threshold", "Automatic abnormal-condition detection", "GSM-based SMS notification", "Remote alert capability", "Local buzzer indication", "LED status indication", "Display of temperature information", "Embedded controller-based operation"],
    operation: ["01 \u2014 Temperature Measurement", "The temperature sensor continuously measures the temperature of the monitored environment.", "02 \u2014 Data Processing", "The microcontroller receives and processes the temperature reading.", "03 \u2014 Threshold Comparison", "The measured temperature is compared with the predefined safety threshold.", "04 \u2014 Abnormal Condition Detection", "If the temperature exceeds the configured limit, the system identifies an abnormal temperature condition.", "05 \u2014 Local Warning", "The buzzer and LED indicators provide an immediate local warning.", "06 \u2014 SMS Alert", "The GSM module automatically sends an SMS notification to the registered mobile number.", "07 \u2014 Continuous Monitoring", "The system continues monitoring temperature and remains ready to identify further abnormal conditions."],
    technologies: ["Temperature Sensor", "Microcontroller", "GSM", "Display", "Buzzer", "LED"],
    applications: ["Industrial equipment monitoring", "Server rooms", "Electrical panels", "Laboratories", "Storage facilities", "Temperature-sensitive environments", "Machinery monitoring", "Equipment safety systems"],
    outcome: "A functional temperature-monitoring prototype was developed to demonstrate real-time temperature measurement and automatic remote alert generation.\n\nThe system integrates temperature sensing, threshold-based decision making, local warning and GSM communication into a compact safety-monitoring platform.",
    highlights: ["REAL-TIME MONITORINGContinuously measures the temperature of the monitored environment.", "THRESHOLD DETECTIONIdentifies abnormal temperature conditions using a predefined limit.", "LOCAL ALERTProvides immediate buzzer and LED indications.", "SMS NOTIFICATIONUses GSM communication to remotely notify the user.", "REMOTE SAFETY MONITORINGAllows abnormal conditions to be reported even when the user is away from the monitored location."],
    slug: "temperature-monitoring-sms-alert-system",
    image: projectImg_16
  },
  {
    id: "vehicle-cabin-air-quality-monitoring-smart-purification-system",
    number: "17",
    title: "Vehicle Cabin Air Quality Monitoring & Smart Purification System",
    filename: "Vehicle Cabin Air Quality Monitoring & Smart Purification System",
    category: "AUTOMOTIVE \u00b7 IoT \u00b7 ENVIRONMENT",
    categories: ["ALL", "ENVIRONMENT", "MOBILITY", "EMBEDDED", "IoT"],
    shortDescription: "A connected automotive system that monitors vehicle cabin air quality, temperature and humidity while providing real-time dashboards and intelligent air-purifier control.",
    overview: "The Vehicle Cabin Air Quality Monitoring & Smart Purification System is an automotive-focused IoT platform designed to continuously monitor the air conditions inside a vehicle cabin.\n\nThe system measures relevant air-quality and environmental parameters such as air quality, temperature and humidity. The collected information is presented through a local display and connected web dashboards, allowing users to monitor cabin conditions through a phone or laptop.\n\nThe system can also control an air-purification unit, creating a smart monitoring and response platform for improving cabin air conditions.",
    problem: "Modern vehicles operate in enclosed environments where air quality can change due to pollution, dust, gases, temperature and humidity.\n\nWithout continuous monitoring, occupants may not have clear visibility into the condition of the air inside the cabin. Manual operation of an air purifier also requires the user to continuously monitor the environment and decide when purification is required.",
    solution: "The system continuously monitors the vehicle cabin using air-quality and environmental sensors.\n\nThe ESP32 processes the sensor information and provides real-time information through a local display as well as a web-based dashboard that can be accessed from a phone or laptop.\n\nWhen required, the system can automatically control the connected air purifier, allowing the vehicle cabin to respond to changing air-quality conditions.",
    features: ["Real-time vehicle cabin air-quality monitoring", "Temperature monitoring", "Humidity monitoring", "Local display", "Web-based monitoring dashboard", "Mobile monitoring", "Laptop monitoring", "Automatic air-purifier control", "Manual purifier control capability", "ESP32-based IoT architecture", "Continuous environmental monitoring"],
    operation: ["01 \u2014 Cabin Sensing", "Sensors continuously monitor air-quality and environmental conditions inside the vehicle cabin.", "02 \u2014 Data Acquisition", "The ESP32 collects the sensor measurements in real time.", "03 \u2014 Data Processing", "The controller processes the collected parameters and determines the current cabin condition.", "04 \u2014 Local Monitoring", "Relevant information is displayed locally for immediate observation.", "05 \u2014 Web Dashboard", "The monitoring data is made available through a web dashboard that can be accessed using a phone or laptop.", "06 \u2014 Purification Control", "The system can control a connected air purifier based on the monitored cabin condition.", "07 \u2014 Continuous Monitoring", "The system continuously tracks cabin conditions and updates the monitoring interface."],
    technologies: ["ESP32", "Air Quality Sensor", "Temperature & Humidity Sensor", "OLED", "IoT Dashboard", "Air Purifier"],
    applications: ["Passenger vehicles", "Cars", "Commercial vehicles", "Fleet vehicles", "Electric vehicles", "Connected-car systems", "Automotive environmental monitoring", "Smart cabin systems"],
    outcome: "A functional vehicle-cabin monitoring prototype was developed to demonstrate the integration of air-quality sensing, environmental monitoring, IoT connectivity and automated purification control.\n\nThe system provides users with real-time visibility into cabin conditions while creating the foundation for intelligent vehicle environmental-management systems.",
    highlights: ["CABIN AIR MONITORINGContinuously monitors air conditions inside the vehicle.", "ENVIRONMENTAL SENSINGTracks relevant temperature and humidity conditions alongside air quality.", "CONNECTED DASHBOARDProvides monitoring through a phone or laptop web interface.", "SMART PURIFICATIONCan automatically control an air purifier based on monitored conditions.", "AUTOMOTIVE IoTCombines embedded sensing, wireless connectivity and automated control into a vehicle-focused system."],
    slug: "vehicle-cabin-air-quality-monitoring-smart-purification-system",
    image: projectImg_17
  }
];
