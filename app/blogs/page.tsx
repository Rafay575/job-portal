'use client';

import { useState } from 'react';

export default function BlogsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const blogs = [
    {
      id: 1,
      title: '10 Tips to Ace Your Job Interview',
      category: 'career',
      date: 'Feb 15, 2026',
      excerpt: 'Learn proven strategies and techniques to make a lasting impression during your next job interview.',
      readTime: '5 min read',
      image: '📋'
    },
    {
      id: 2,
      title: 'Negotiating Your Salary Package',
      category: 'salary',
      date: 'Feb 10, 2026',
      excerpt: 'Expert advice on how to negotiate your compensation package and get what you deserve.',
      readTime: '7 min read',
      image: '💰'
    },
    {
      id: 3,
      title: 'Building an Impressive LinkedIn Profile',
      category: 'career',
      date: 'Feb 5, 2026',
      excerpt: 'Optimize your LinkedIn profile to attract recruiters and stand out from other candidates.',
      readTime: '6 min read',
      image: '🔗'
    },
    {
      id: 4,
      title: 'Top In-Demand Skills in 2026',
      category: 'skills',
      date: 'Jan 30, 2026',
      excerpt: 'Discover the most sought-after skills that employers are looking for this year.',
      readTime: '8 min read',
      image: '⚡'
    },
    {
      id: 5,
      title: 'Remote Work: Pros and Cons',
      category: 'trends',
      date: 'Jan 25, 2026',
      excerpt: 'An honest look at the benefits and challenges of working remotely in 2026.',
      readTime: '6 min read',
      image: '🏠'
    },
    {
      id: 6,
      title: 'Career Transition: Your Complete Guide',
      category: 'career',
      date: 'Jan 20, 2026',
      excerpt: 'Step-by-step guide to successfully transitioning into a new career path.',
      readTime: '10 min read',
      image: '🚀'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Articles' },
    { id: 'career', label: 'Career' },
    { id: 'salary', label: 'Salary' },
    { id: 'skills', label: 'Skills' },
    { id: 'trends', label: 'Trends' }
  ];

  const filteredBlogs = selectedCategory === 'all' 
    ? blogs 
    : blogs.filter(blog => blog.category === selectedCategory);

  return (
    <main className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 text-balance">
            Career Insights & Tips
          </h1>
          <p className="text-lg text-muted-foreground text-balance">
            Read expert advice and industry insights to advance your career
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Category Filter */}
          <div className="mb-12">
            <h2 className="text-sm font-semibold text-muted-foreground mb-4 uppercase">Filter by Category</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full font-medium transition duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-primary/10 text-primary hover:bg-primary/20'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map(blog => (
              <article
                key={blog.id}
                className="group border border-primary/20 rounded-lg overflow-hidden bg-card hover:border-primary/40 transition duration-300 cursor-pointer"
              >
                {/* Blog Image */}
                <div className="h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center overflow-hidden group-hover:from-primary/20 group-hover:to-primary/10 transition duration-300">
                  <span className="text-6xl">{blog.image}</span>
                </div>

                {/* Blog Content */}
                <div className="p-6 flex flex-col h-full">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase text-primary">
                      {blog.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{blog.readTime}</span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition duration-200 line-clamp-2">
                    {blog.title}
                  </h3>

                  <p className="text-foreground/70 text-sm mb-4 flex-grow line-clamp-2">
                    {blog.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-primary/10">
                    <span className="text-xs text-muted-foreground">{blog.date}</span>
                    <span className="text-sm font-semibold text-primary group-hover:translate-x-1 transition duration-200">
                      Read →
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* No Results */}
          {filteredBlogs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-foreground/60 mb-4">No articles found in this category.</p>
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-primary font-semibold hover:underline"
              >
                View all articles
              </button>
            </div>
          )}

          
        </div>
      </section>
    </main>
  );
}
