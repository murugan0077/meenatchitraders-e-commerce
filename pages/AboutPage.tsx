
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              About MeenatchiTraders
            </h1>
            <p className="mt-6 text-xl text-gray-600">
              Your reliable source for high-quality cleaning and household products since 2005.
            </p>
          </div>
          
          <div className="mt-16 text-lg text-gray-700 space-y-8">
            <p>
              Founded with a mission to provide effective and affordable cleaning solutions, MeenatchiTraders has grown from a small local supplier to a trusted name in the industry. We are dedicated to sourcing and manufacturing products that meet the highest standards of quality and performance.
            </p>
            <p>
              Our commitment extends beyond our products. We believe in building lasting relationships with our customers, providing exceptional service, and contributing positively to our community. We understand the importance of a clean and safe environment, whether it's in your home or your workplace.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="bg-green-50 p-8 rounded-lg">
                <h3 className="text-2xl font-bold text-brand-green mb-4">Our Mission</h3>
                <p>To deliver superior cleaning products that ensure a hygienic and healthy living environment for everyone, backed by our commitment to customer satisfaction and sustainable practices.</p>
              </div>
              <div className="bg-blue-50 p-8 rounded-lg">
                <h3 className="text-2xl font-bold text-brand-blue mb-4">Our Vision</h3>
                <p>To be the leading provider of cleaning solutions in the region, recognized for our product innovation, quality, and unwavering dedication to our customers' needs.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
