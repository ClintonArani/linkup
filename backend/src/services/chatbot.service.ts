interface ChatbotResponse {
    response: string;
}

export class ChatbotService {
    async processMessage(message: string): Promise<ChatbotResponse> {
        const intent = this.detectIntent(message.toLowerCase());
        
        try {
            switch(intent.type) {
                // 1. GREETINGS & BASIC INTERACTIONS
                case 'greeting': return this.handleGreeting();
                case 'goodbye': return this.handleGoodbye();
                case 'thanks': return this.handleThanks();
                case 'positive_feedback': return this.handlePositiveFeedback();
                case 'negative_feedback': return this.handleNegativeFeedback();

                // 2. PLATFORM INFORMATION
                case 'ceo_info': return this.handleCeoInfo();
                case 'platform_history': return this.handlePlatformHistory();
                case 'user_stats': return this.handleUserStats();

                // 3. BOOK MANAGEMENT
                case 'borrow_book': return this.handleBorrowBook();
                case 'return_book': return this.handleReturnBook();
                case 'overdue_books': return this.handleOverdueBooks();
                case 'book_donation': return this.handleBookDonation();

                // 4. NETWORKING FEATURES
                case 'send_connect': return this.handleSendConnect();
                case 'accept_connect': return this.handleAcceptConnect();
                case 'view_network': return this.handleViewNetwork();
                case 'chat_feature': return this.handleChatFeature();

                // 5. ATTACHMENTS & INTERNSHIPS
                case 'apply_attachment': return this.handleApplyAttachment();
                case 'view_opportunities': return this.handleViewOpportunities();
                case 'post_opportunity': return this.handlePostOpportunity();

                // 6. ACCOUNT HELP
                case 'create_account': return this.handleCreateAccount();
                case 'reset_password': return this.handleResetPassword();
                case 'update_profile': return this.handleUpdateProfile();

                // 7. CONTACT & SUPPORT
                case 'contact_info': return this.handleContactInfo();
                case 'support_hours': return this.handleSupportHours();
                case 'headquarters': return this.handleHeadquarters();

                // 8. GENERAL HELP
                case 'capabilities': return this.handleCapabilities();
                case 'suggested_questions': return this.handleSuggestedQuestions();
                case 'general_help': return this.handleGeneralHelp();

                // 9. MISCELLANEOUS
                case 'fun_question': return this.handleFunQuestion();

                default: return this.handleUnknownIntent();
            }
        } catch (error) {
            console.error('Chatbot error:', error);
            return { response: "Sorry, I encountered an error. Please try again later." };
        }
    }

    private detectIntent(message: string): { type: string } {
        // 1. GREETINGS & BASIC INTERACTIONS
        if (/^(hi|hello|hey|good morning|good afternoon|good evening|morning|hey there|what's up|howdy|greetings|salutations|yo|sup|good day|rise and shine|hey bot|hello chatbot)/i.test(message)) {
            return { type: 'greeting' };
        }
        if (/^(bye|goodbye|see you|see ya|farewell|take care|until next time|have a good one|i'm done|that's all|thanks, bye|bye for now|later|catch you later|signing off)/i.test(message)) {
            return { type: 'goodbye' };
        }
        if (/^(thanks|thank you|appreciate it|much obliged|cheers|thanks a lot|thank you very much|i appreciate it|many thanks|big thanks|thanks a bunch|thanks a ton|thanks a million)/i.test(message)) {
            return { type: 'thanks' };
        }
        if (/^(great job|awesome|perfect|excellent|wonderful|fantastic|amazing|terrific|brilliant|you're the best)/i.test(message)) {
            return { type: 'positive_feedback' };
        }
        if (/^(that's not helpful|i don't understand|this isn't what i asked|you're not making sense|that's wrong|incorrect|not useful|try again|i need a better answer|that doesn't help)/i.test(message)) {
            return { type: 'negative_feedback' };
        }

        // 2. PLATFORM INFORMATION
        if (/^(who is the ceo|who owns this platform|who is clinton|tell me about your ceo|who founded this platform|who runs this service|who is in charge here|who is your boss|who is the owner|who is the founder)/i.test(message)) {
            return { type: 'ceo_info' };
        }
        if (/^(when was linkup founded|how old is this platform|when did you start|what's your founding date|when was this established|how long have you been around|when was this service created|what year was linkup started|how long has this platform existed|when was this organization founded)/i.test(message)) {
            return { type: 'platform_history' };
        }
        if (/^(how many users do you have|what's your user count|how many students use linkup|how large is your user base|how many members do you have|what's your member number|how many students do you serve|how many users have joined|what's your user count|how many people use your platform)/i.test(message)) {
            return { type: 'user_stats' };
        }

        // 3. BOOK MANAGEMENT
        if (/^(how do i borrow a book|can i borrow books|how does book borrowing work|what if i want to borrow a book|do you lend books|what's your borrowing policy|how do i get a book|can i check out books|what are your borrowing conditions|how long can i keep books)/i.test(message)) {
            return { type: 'borrow_book' };
        }
        if (/^(how do i return a book|where do i return books|what's the return process|how to give back a book|where are book drop off points|what if i want to return a book early|can i return books to any campus|is there a book return box|how do i complete book return|what's the book return procedure)/i.test(message)) {
            return { type: 'return_book' };
        }
        if (/^(what happens if my book is overdue|how much are late fees|what's the penalty for overdue books|how do i know if my book is late|can i renew an overdue book|what if i can't return a book on time|how are overdue books handled|do you charge for late returns|what's your overdue policy|can i get extension on book return)/i.test(message)) {
            return { type: 'overdue_books' };
        }
        if (/^(can i donate books|how to donate textbooks|does linkup accept book donations|where can i donate my old books|what's your donation policy|how do i give books to the platform|are book donations tax deductible|what kinds of books can i donate|is there a book donation drive|where do i bring books to donate)/i.test(message)) {
            return { type: 'book_donation' };
        }

        // 4. NETWORKING FEATURES
        if (/^(how do i connect with someone|what's a connect request|how to send connection request|what does sending a connect mean|how to network with other students|can i connect with alumni|how do i add friends on linkup|what's the purpose of connects|how to build my network|can i connect with students from other schools)/i.test(message)) {
            return { type: 'send_connect' };
        }
        if (/^(how do i accept a connection|where do i see pending requests|what to do with connection invites|how to approve a connect request|where are my network invitations|can i ignore a connect request|how long do connection requests last|what happens when i accept a connect|how to manage my connections|can i see who wants to connect)/i.test(message)) {
            return { type: 'accept_connect' };
        }
        if (/^(how do i see my network|where can i view my connections|how to check who's in my network|can i search my connections|how to organize my network|is there a map of my connections|how to filter my network|can i see connection degrees|how to find mutual connections|what's my network size)/i.test(message)) {
            return { type: 'view_network' };
        }
        if (/^(how does the chat work|can i message other students|is there real-time messaging|how to start a conversation|are chats private|can i send files through chat|how to create a group chat|are there chat rules|can i video chat|how to report inappropriate chat)/i.test(message)) {
            return { type: 'chat_feature' };
        }

        // 5. ATTACHMENTS & INTERNSHIPS
        if (/^(how do i apply for attachment|where are attachment opportunities|how to find internships|what's the application process|can i apply through linkup|how to submit attachment application|where are external links for applications|how do i use the opportunity links|what attachments are available|how to search for internships)/i.test(message)) {
            return { type: 'apply_attachment' };
        }
        if (/^(where can i see available opportunities|how to browse internships|what opportunities are posted|how to filter attachment listings|can i see expired opportunities|how to search for specific attachments|are there international opportunities|how often are new opportunities added|can i save opportunities|how to get notifications for new postings)/i.test(message)) {
            return { type: 'view_opportunities' };
        }
        if (/^(how do i post an opportunity|can companies list attachments|what's the process for posting internships|how to share an opportunity|are there guidelines for posting|can alumni post opportunities|what information is needed to post|is there a verification process|how long do postings stay active|can i edit my posted opportunity)/i.test(message)) {
            return { type: 'post_opportunity' };
        }

        // 6. ACCOUNT HELP
        if (/^(how do i create an account|what's the signup process|how to register for linkup|can i join as alumni|what information is needed to sign up|is there a verification process|can i use my school email|how long does approval take|what if i don't have a university email|can i edit my profile after signing up)/i.test(message)) {
            return { type: 'create_account' };
        }
        if (/^(i forgot my password|how to reset my password|what if i can't log in|how to recover my account|where is the password reset link|what's the account recovery process|can i change my password|how long does password reset take|what if reset email doesn't arrive|can i set up security questions)/i.test(message)) {
            return { type: 'reset_password' };
        }
        if (/^(how do i update my profile|can i change my profile picture|how to edit my information|where do i update my bio|can i add more education history|how to change my displayed name|what profile fields are required|can i hide some profile information|how to add skills to my profile|can i connect my social media)/i.test(message)) {
            return { type: 'update_profile' };
        }

        // 7. CONTACT & SUPPORT
        if (/^(how can i contact you|what's your email|what's your phone number|where are you located|how do i reach support|what's your contact information|how can i get in touch|where can i find your details|what's your support email|do you have a customer service number)/i.test(message)) {
            return { type: 'contact_info' };
        }
        if (/^(what are your support hours|when is customer service available|what time does support open|when can i contact support|what are your operating hours|is support available 24\/7|what days is support open|when do you close|what are your business hours|how late is support available)/i.test(message)) {
            return { type: 'support_hours' };
        }
        if (/^(where is your headquarters|what's your main office location|where are you based|where is your company located|what's your physical address|where can i visit your office|do you have a physical location|what city are you in|where is your home office|can i visit your headquarters)/i.test(message)) {
            return { type: 'headquarters' };
        }

        // 8. GENERAL HELP
        if (/^(what can you do|what do you know|what information can you provide|what can you tell me|what are your capabilities|how can you help me|what questions can you answer|what are you good at|what do you specialize in|what kind of help can you offer)/i.test(message)) {
            return { type: 'capabilities' };
        }
        if (/^(what can i ask you|give me some question ideas|what questions do you answer|what should i ask|what information do you have|what topics can we discuss|suggest some questions|give me examples of what to ask|what do people usually ask|show me possible questions)/i.test(message)) {
            return { type: 'suggested_questions' };
        }
        if (/^(help|i need help|can you help me|assist me|i need assistance|guide me|what should i do|i'm confused|not sure what to ask|what options do i have)/i.test(message)) {
            return { type: 'general_help' };
        }

        // 9. MISCELLANEOUS
        if (/^(how are you|what's your name|who made you|are you human|what can you do besides chat|tell me a joke|what's the weather|what time is it|do you like your job|are you smart)/i.test(message)) {
            return { type: 'fun_question' };
        }

        return { type: 'unknown' };
    }

    // ================== HANDLER METHODS ================== //

    // 1. GREETINGS & BASIC INTERACTIONS (kept similar)
    private handleGreeting(): ChatbotResponse {
        const responses = [
            "Hello! Welcome to Linkup. How can I help you today?",
            "Hi there! Ready to connect with fellow students? What can I do for you?",
            "Greetings! How may I assist you with Linkup today?",
            "Good day! Looking to borrow books or network with peers?",
            "Hello student! What would you like to know about Linkup?"
        ];
        return { response: this.getRandomResponse(responses) };
    }

    private handleGoodbye(): ChatbotResponse {
        const responses = [
            "Goodbye! Keep connecting with your fellow students!",
            "See you later! Come back anytime you need academic resources.",
            "Take care! Don't forget to return any borrowed books on time!",
            "Farewell! Keep building your student network.",
            "Until next time! Happy studying!"
        ];
        return { response: this.getRandomResponse(responses) };
    }

    private handleThanks(): ChatbotResponse {
        const responses = [
            "You're very welcome! Keep exploring Linkup's features!",
            "My pleasure! Don't hesitate to ask if you need anything else.",
            "Happy to help a fellow student! Let me know if you have other questions.",
            "No problem at all! We're here to support your academic journey.",
            "Glad I could assist! Come back anytime you need help."
        ];
        return { response: this.getRandomResponse(responses) };
    }

    private handlePositiveFeedback(): ChatbotResponse {
        const responses = [
            "Thank you! I'm glad I could help with your student needs.",
            "I appreciate your kind words! Keep using Linkup to its fullest.",
            "That makes my day! Let me know if you need anything else for your studies.",
            "Thanks for the positive feedback! We're here for students like you.",
            "You're too kind! How else can I assist with your academic journey?"
        ];
        return { response: this.getRandomResponse(responses) };
    }

    private handleNegativeFeedback(): ChatbotResponse {
        const responses = [
            "I'm sorry I couldn't help better. Could you rephrase your question about Linkup?",
            "My apologies. Let me try to understand better - what exactly do you need help with?",
            "I want to help with your student needs. Could you ask your question differently?",
            "Sorry about that. What Linkup feature are you having trouble with?",
            "I'll try to do better. What can I clarify about our student platform?"
        ];
        return { response: this.getRandomResponse(responses) };
    }

    // 2. PLATFORM INFORMATION
    private handleCeoInfo(): ChatbotResponse {
        return {
            response: "Linkup is led by CEO Clinton Omari, who founded the platform with " +
                     "a vision to connect students across universities and facilitate resource sharing."
        };
    }

    private handlePlatformHistory(): ChatbotResponse {
        return {
            response: "Linkup was launched on March 10, 2022, and has been growing steadily ever since, " +
                     "connecting thousands of students from various universities and facilitating " +
                     "book sharing, networking, and career opportunities."
        };
    }

    private handleUserStats(): ChatbotResponse {
        return {
            response: "We're proud to have connected over 25,000 students from 15+ universities " +
                     "and facilitated more than 10,000 book exchanges since our launch."
        };
    }

    // 3. BOOK MANAGEMENT
    private handleBorrowBook(): ChatbotResponse {
        return {
            response: "Borrowing books on Linkup:\n" +
                     "• Search for available books in your campus network\n" +
                     "• Request the book from the current holder\n" +
                     "• Arrange pickup through the platform\n" +
                     "• Standard loan period: 2 weeks (renewable)\n" +
                     "• You'll get reminders as due date approaches"
        };
    }

    private handleReturnBook(): ChatbotResponse {
        return {
            response: "Returning books:\n" +
                     "• Mark the book as 'ready for return' in your account\n" +
                     "• Arrange return with the owner or drop at campus hubs\n" +
                     "• Confirm return in the system when complete\n" +
                     "• Books can be returned to any participating campus location\n" +
                     "• Late returns affect your borrowing privileges"
        };
    }

    private handleOverdueBooks(): ChatbotResponse {
        return {
            response: "Overdue book policy:\n" +
                     "• 1-3 days late: Warning notification\n" +
                     "• 4-7 days late: Temporary borrowing suspension\n" +
                     "• 8+ days late: Account restriction until return\n" +
                     "• Repeated offenses may lead to permanent restrictions\n" +
                     "• Always communicate with the book owner if you need more time"
        };
    }

    private handleBookDonation(): ChatbotResponse {
        return {
            response: "We welcome book donations!\n" +
                     "• Textbooks in good condition preferred\n" +
                     "• Drop off at any campus hub during operating hours\n" +
                     "• Receive recognition in our donor system\n" +
                     "• Donated books help students who can't afford them\n" +
                     "• Contact support for large donations or special arrangements"
        };
    }

    // 4. NETWORKING FEATURES
    private handleSendConnect(): ChatbotResponse {
        return {
            response: "Sending connects:\n" +
                     "1. Find students through search or suggestions\n" +
                     "2. View their profile and click 'Send Connect'\n" +
                     "3. Add a personal message (optional)\n" +
                     "4. Wait for them to accept your request\n" +
                     "5. Connects help build your academic network\n" +
                     "6. You can connect across different universities"
        };
    }

    private handleAcceptConnect(): ChatbotResponse {
        return {
            response: "Managing connection requests:\n" +
                     "• View pending requests in your 'Network' tab\n" +
                     "• Accept or decline each request individually\n" +
                     "• Accepted connects can message you directly\n" +
                     "• You can remove connections later if needed\n" +
                     "• There's no limit to how many connects you can have"
        };
    }

    private handleViewNetwork(): ChatbotResponse {
        return {
            response: "Your Linkup network:\n" +
                     "• Access through the 'My Network' section\n" +
                     "• Filter by university, major, or graduation year\n" +
                     "• See mutual connections with other students\n" +
                     "• Organize contacts into groups (study buddies, classmates, etc.)\n" +
                     "• Your network grows as you accept more connects"
        };
    }

    private handleChatFeature(): ChatbotResponse {
        return {
            response: "Linkup chat features:\n" +
                     "• Real-time messaging with your connections\n" +
                     "• Support for text, images, and document sharing\n" +
                     "• Group chats for study groups or projects\n" +
                     "• End-to-end encryption for privacy\n" +
                     "• Chat history maintained for 6 months\n" +
                     "• Report inappropriate messages through the app"
        };
    }

    // 5. ATTACHMENTS & INTERNSHIPS
    private handleApplyAttachment(): ChatbotResponse {
        return {
            response: "Applying for attachments:\n" +
                     "1. Browse opportunities in the 'Careers' section\n" +
                     "2. Filter by location, field, or duration\n" +
                     "3. Click on an opportunity to view details\n" +
                     "4. Use the external link to apply directly\n" +
                     "5. Track your applications in your profile\n" +
                     "6. Get notifications when new opportunities match your interests"
        };
    }

    private handleViewOpportunities(): ChatbotResponse {
        return {
            response: "Finding opportunities:\n" +
                     "• Updated weekly by our team and partner organizations\n" +
                     "• Search by keywords or use advanced filters\n" +
                     "• Save interesting postings to review later\n" +
                     "• See which opportunities your connections have applied to\n" +
                     "• Alumni often post exclusive opportunities for Linkup students"
        };
    }

    private handlePostOpportunity(): ChatbotResponse {
        return {
            response: "Posting opportunities:\n" +
                     "• Verified organizations can post through our portal\n" +
                     "• Provide position details, requirements, and application link\n" +
                     "• Opportunities are reviewed within 24 hours\n" +
                     "• Active for 30 days (can be extended)\n" +
                     "• Alumni can post opportunities for their organizations\n" +
                     "• Contact support to get posting privileges"
        };
    }

    // 6. ACCOUNT HELP
    private handleCreateAccount(): ChatbotResponse {
        return {
            response: "Creating your Linkup account:\n" +
                     "1. Visit our website or download the app\n" +
                     "2. Click 'Sign Up' and select 'Student' or 'Alumni'\n" +
                     "3. Verify your university email address\n" +
                     "4. Complete your profile with academic information\n" +
                     "5. Set up your privacy preferences\n" +
                     "6. Start connecting with fellow students!\n" +
                     "Note: Alumni accounts require graduation verification"
        };
    }

    private handleResetPassword(): ChatbotResponse {
        return {
            response: "Password reset process:\n" +
                     "1. Click 'Forgot Password' on login page\n" +
                     "2. Enter your registered email\n" +
                     "3. Check your inbox for reset link (valid for 1 hour)\n" +
                     "4. Create a new strong password\n" +
                     "5. Log in with your new credentials\n" +
                     "If you don't receive the email, check spam or contact support"
        };
    }

    private handleUpdateProfile(): ChatbotResponse {
        return {
            response: "Updating your profile:\n" +
                     "• Click on your profile picture > 'Edit Profile'\n" +
                     "• Update academic information as you progress\n" +
                     "• Add skills, projects, and interests\n" +
                     "• Control what information is visible to others\n" +
                     "• Alumni can update their career information\n" +
                     "• Complete profiles get more connection requests"
        };
    }

    // 7. CONTACT & SUPPORT
    private handleContactInfo(): ChatbotResponse {
        return {
            response: "Contact Linkup:\n" +
                     "📧 Email: clintonarani@gmail.com\n" +
                     "📞 Phone: 0791736576\n" +
                     "📍 Address: 456 University Plaza, Nairobi\n" +
                     "💬 In-app support available 24/7\n" +
                     "For urgent matters, please call directly"
        };
    }

    private handleSupportHours(): ChatbotResponse {
        return {
            response: "Support availability:\n" +
                     "Monday-Friday: 7:00 AM - 9:00 PM\n" +
                     "Saturday: 9:00 AM - 5:00 PM\n" +
                     "Sunday: 10:00 AM - 4:00 PM\n" +
                     "Emergency support: Always available through in-app chat"
        };
    }

    private handleHeadquarters(): ChatbotResponse {
        return {
            response: "Our headquarters:\n" +
                     "456 University Plaza\n" +
                     "Nairobi, Kenya\n" +
                     "Student visits welcome Mon-Fri 10AM-4PM\n" +
                     "Campus representatives available at all partner universities"
        };
    }

    // 8. GENERAL HELP
    private handleCapabilities(): ChatbotResponse {
        return {
            response: "I can help with:\n" +
                     "• Book borrowing and returns\n" +
                     "• Student networking features\n" +
                     "• Attachment/internship opportunities\n" +
                     "• Account management\n" +
                     "• Platform information\n" +
                     "• Troubleshooting issues"
        };
    }

    private handleSuggestedQuestions(): ChatbotResponse {
        return {
            response: "Try asking about:\n" +
                     "1. How to borrow or return books\n" +
                     "2. Sending or accepting connection requests\n" +
                     "3. Finding attachment opportunities\n" +
                     "4. Updating your profile information\n" +
                     "5. Platform policies and features\n" +
                     "6. Contacting support"
        };
    }

    private handleGeneralHelp(): ChatbotResponse {
        return {
            response: "I'm here to help with all things Linkup! You can ask me about:\n\n" +
                     "• Connecting with other students\n" +
                     "• Borrowing and sharing academic resources\n" +
                     "• Finding career opportunities\n" +
                     "• Managing your account\n\n" +
                     "What would you like to know?"
        };
    }

    // 9. MISCELLANEOUS
    private handleFunQuestion(): ChatbotResponse {
        const responses = [
            "I'm a chatbot, so I don't have feelings, but I'm always happy to help students!",
            "My name is Linkup Assistant. Nice to meet a fellow learner!",
            "I was created to help students like you connect and share resources.",
            "Why did the student eat their homework? Because the teacher said it was a piece of cake!",
            "The best weather is perfect study weather!",
            "My clock says it's always time to learn and connect!",
            "I love my job helping students succeed!",
            "I'm smart enough to help with your questions, but still learning about student life!",
            "Did you hear about the math student who's afraid of negative numbers? They'll stop at nothing to avoid them!",
            "What's a student's favorite candy? An M&M-asters degree!"
        ];
        return { response: this.getRandomResponse(responses) };
    }

    private handleUnknownIntent(): ChatbotResponse {
        return {
            response: "I'm not sure I understand. Try asking about:\n" +
                     "• Book borrowing and returns\n" +
                     "• Student networking\n" +
                     "• Attachment opportunities\n" +
                     "• Your Linkup account\n" +
                     "Or type 'help' for more suggestions."
        };
    }

    private getRandomResponse(responses: string[]): string {
        return responses[Math.floor(Math.random() * responses.length)];
    }
}