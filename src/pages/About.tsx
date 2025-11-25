import React from 'react';

const About: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">            <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                About FPT Learnify AI
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                We're passionate about making English learning accessible, effective, and enjoyable for everyone through AI-powered technology.
            </p>
        </div>

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Our Mission
                    </h3>
                    <p className="text-gray-600">
                        To provide world-class English education through innovative technology and
                        personalized learning experiences that adapt to each learner's unique needs.
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Our Vision
                    </h3>
                    <p className="text-gray-600">
                        A world where language barriers don't limit opportunities, and everyone
                        has access to quality English education regardless of their background.
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Our Values
                    </h3>
                    <p className="text-gray-600">
                        Innovation, accessibility, excellence, and community. We believe learning
                        should be engaging, effective, and available to all.
                    </p>
                </div>
            </div>

            <div className="mt-16">
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
                    Why Choose Us?
                </h2>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                Cutting-Edge Technology
                            </h3>
                            <p className="mt-2 text-base text-gray-500">
                                Our platform uses AI and machine learning to provide personalized
                                learning experiences and real-time feedback.
                            </p>
                        </div>
                    </div>

                    <div className="flex">
                        <div className="flex-shrink-0">
                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                Expert-Designed Content
                            </h3>
                            <p className="mt-2 text-base text-gray-500">
                                All our lessons are created by experienced English teachers and
                                linguists following proven pedagogical methods.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
