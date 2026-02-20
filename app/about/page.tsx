'use client';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-primary">
            About Our Platform
          </h1>
          <p className="text-lg text-muted-foreground text-balance md:w-[70%]">
            By combining intelligent matching algorithms with a user-centric approach, we empower job seekers to take control of their career journey and help employers discover exceptional talent.By combining intelligent matching algorithms with a user-centric approach, we empower job seekers to take control of their career journey and help employers discover exceptional talent.By combining intelligent matching algorithms with a user-centric approach, we empower job seekers to take control of their career journey and help employers discover exceptional talent.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6 space-y-12">
          {/* Mission Section */}
          <div>
            <h2 className="text-3xl font-bold text-primary mb-4">Our Mission</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              We believe that finding the right job should be effortless and rewarding. Our platform is designed to match talented professionals with opportunities that align with their skills, aspirations, and values.We believe that finding the right job should be effortless and rewarding. Our platform is designed to match talented professionals with opportunities that align with their skills, aspirations, and values.We believe that finding the right job should be effortless and rewarding. Our platform is designed to match talented professionals with opportunities that align with their skills, aspirations, and values.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              By combining intelligent matching algorithms with a user-centric approach, we empower job seekers to take control of their career journey and help employers discover exceptional talent.By combining intelligent matching algorithms with a user-centric approach, we empower job seekers to take control of their career journey and help employers discover exceptional talent.By combining intelligent matching algorithms with a user-centric approach, we empower job seekers to take control of their career journey and help employers discover exceptional talent.By combining intelligent matching algorithms with a user-centric approach, we empower job seekers to take control of their career journey and help employers discover exceptional talent.
            </p>
          </div>

          {/* Why Choose Us */}
          <div>
            <h2 className="text-3xl font-bold t text-primary mb-6">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Smart Matching',
                  description: 'Our AI-powered algorithms match you with positions that truly fit your profile and preferences.'
                },
                {
                  title: 'Transparent Process',
                  description: 'Know exactly what to expect with clear salary ranges, benefits, and job descriptions.'
                },
                {
                  title: 'Career Growth',
                  description: 'Access resources and insights to help you advance your professional development.'
                },
                {
                  title: 'Community Support',
                  description: 'Connect with other professionals, mentors, and industry experts on our platform.'
                }
              ].map((item, index) => (
                <div key={index} className="p-6 border border-primary/20 rounded-lg bg-primary/5">
                  <h3 className="text-lg font-semibold text-primary mb-2">{item.title}</h3>
                  <p className="text-foreground/80">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div>
            <h2 className="text-3xl font-bold  text-primary mb-6">By The Numbers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { number: '50K+', label: 'Active Job Seekers' },
                { number: '10K+', label: 'Job Listings' },
                { number: '2K+', label: 'Companies Hiring' }
              ].map((stat, index) => (
                <div key={index} className="p-6 bg-primary/10 rounded-lg text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-foreground/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Values Section */}
          <div>
            <h2 className="text-3xl font-bold  text-primary mb-4">Our Values</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              We are committed to creating an inclusive, transparent, and empowering platform that serves both job seekers and employers with integrity and excellence.We are committed to creating an inclusive, transparent, and empowering platform that serves both job seekers and employers with integrity and excellence.We are committed to creating an inclusive, transparent, and empowering platform that serves both job seekers and employers with integrity and excellence.
            </p>
            <ul className="space-y-3">
              {['Integrity & Transparency', 'User-Centric Innovation', 'Diversity & Inclusion', 'Continuous Improvement'].map((value, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-foreground/80">{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
