import React, { forwardRef } from 'react';
import useResumeStore from '../../stateManage/useResumeStore';
import RatingInput from '../ratingInput';

const TemplateTwo = forwardRef((props, ref) => {
  const { resumeData } = useResumeStore();
  const {
    profileInfo = {},
    contactInfo = {},
    workExperience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    languages = [],
    interest = []
  } = resumeData;

  // Color scheme
  const colors = {
    primary: '#4338ca',       // Indigo
    secondary: '#6b7280',     // Gray
    accent: '#10b981',        // Emerald
    background: '#f9fafb',    // Light gray
    text: '#111827',          // Dark gray
    heading: '#1e40af'        // Dark blue
  };

  return (
    <div
      ref={ref}
      className="w-[794px] min-h-[1123px] flex flex-col"
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: '#fff',
        color: colors.text,
        boxSizing: 'border-box',
        overflowWrap: 'break-word',
        wordBreak: 'break-word',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Header Section */}
      <div style={{ 
        backgroundColor: colors.primary,
        color: 'white',
        padding: '24px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          marginBottom: '4px',
          letterSpacing: '1px'
        }}>
          {profileInfo.fullName || 'Your Name'}
        </h1>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '500',
          marginBottom: '8px',
          opacity: 0.9
        }}>
          {profileInfo.designation || 'Your Professional Title'}
        </h2>
      </div>

      {/* Main Content */}
      <div className="flex" style={{ flex: 1 }}>
        {/* Left Column - Profile/Sidebar */}
        <div
          className="w-[30%] p-6"
          style={{
            backgroundColor: colors.background,
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box'
          }}
        >
          {/* Profile Image */}
          {profileInfo.profilePreviewUrl && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '10px'
            }}>
              <img
                src={profileInfo.profilePreviewUrl}
                alt="Profile"
                style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: `4px solid ${colors.primary}`
                }}
              />
            </div>
          )}

          {/* Contact */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              color: colors.heading,
              fontWeight: 'bold',
              marginBottom: '5px',
              fontSize: '16px',
              textTransform: 'uppercase',
              borderBottom: `2px solid ${colors.accent}`,
              paddingBottom: '4px'
            }}>
              Contact
            </h3>
            <ul style={{ 
              fontSize: '13px',
              lineHeight: '1.6',
              listStyle: 'none',
              paddingLeft: '0'
            }}>
              {contactInfo.email && (
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ marginRight: '8px', color: colors.primary }}>✉️</span>
                  {contactInfo.email}
                </li>
              )}
              {contactInfo.phone && (
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ marginRight: '8px', color: colors.primary }}>📱</span>
                  {contactInfo.phone}
                </li>
              )}
              {contactInfo.location && (
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ marginRight: '8px', color: colors.primary }}>📍</span>
                  {contactInfo.location}
                </li>
              )}
              {contactInfo.linkedin && (
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ marginRight: '8px', color: colors.primary }}>🔗</span>
                  {contactInfo.linkedin}
                </li>
              )}
              {contactInfo.github && (
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ marginRight: '8px', color: colors.primary }}>💻</span>
                  {contactInfo.github}
                </li>
              )}
            </ul>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{
                color: colors.heading,
                fontWeight: 'bold',
                marginBottom: '12px',
                fontSize: '16px',
                textTransform: 'uppercase',
                borderBottom: `2px solid ${colors.accent}`,
                paddingBottom: '4px'
              }}>
                Skills
              </h3>
              <ul style={{ 
                fontSize: '13px',
                lineHeight: '1.6',
                listStyle: 'none',
                paddingLeft: '0'
              }}>
                {skills.map((skill, i) => (
                  <li key={i} style={{ marginBottom: '12px' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span>{skill.name}</span>
                      <RatingInput 
                        value={skill.progress} 
                        onChange={() => {}} 
                        total={5} 
                        color={colors.primary}
                        bgColor="#e5e7eb"
                        readOnly
                        size={14}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{
                color: colors.heading,
                fontWeight: 'bold',
                marginBottom: '12px',
                fontSize: '16px',
                textTransform: 'uppercase',
                borderBottom: `2px solid ${colors.accent}`,
                paddingBottom: '4px'
              }}>
                Languages
              </h3>
              <ul style={{ 
                fontSize: '13px',
                lineHeight: '1.6',
                listStyle: 'none',
                paddingLeft: '0'
              }}>
                {languages.map((lang, i) => (
                  <li key={i} style={{ marginBottom: '12px' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span>{lang.name}</span>
                      <RatingInput 
                        value={lang.progress} 
                        onChange={() => {}} 
                        total={5} 
                        color={colors.accent}
                        bgColor="#e5e7eb"
                        readOnly
                        size={14}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Interests */}
          {interest.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{
                color: colors.heading,
                fontWeight: 'bold',
                marginBottom: '12px',
                fontSize: '16px',
                textTransform: 'uppercase',
                borderBottom: `2px solid ${colors.accent}`,
                paddingBottom: '4px'
              }}>
                Interests
              </h3>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {interest.map((item, i) => (
                  <span 
                    key={i}
                    style={{
                      backgroundColor: colors.primary,
                      color: 'white',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Main Content */}
        <div
          className="w-[70%] p-8"
          style={{
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box'
          }}
        >
          {/* Summary */}
          {profileInfo.summary && (
            <div style={{ marginBottom: '10px' }}>
              <h3 style={{
                color: colors.heading,
                fontSize: '18px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                marginBottom: '5px',
                paddingBottom: '4px',
                borderBottom: `2px solid ${colors.accent}`
              }}>
                Professional Summary
              </h3>
              <p style={{ 
                fontSize: '14px',
                lineHeight: '1.6',
                textAlign: 'justify'
              }}>
                {profileInfo.summary}
              </p>
            </div>
          )}

          {/* Work Experience */}
          {workExperience.length > 0 && (
            <div style={{ marginBottom: '10px' }}>
              <h3 style={{
                color: colors.heading,
                fontSize: '18px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                marginBottom: '5px',
                paddingBottom: '4px',
                borderBottom: `2px solid ${colors.accent}`
              }}>
                Work Experience
              </h3>
              {workExperience.map((exp, i) => (
                <div key={i} style={{ marginBottom: '20px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '6px'
                  }}>
                    <p style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: colors.primary
                    }}>
                      {exp.role} • {exp.company}
                    </p>
                    <p style={{
                      fontSize: '14px',
                      color: colors.secondary,
                      fontStyle: 'italic'
                    }}>
                      {exp.startDate} – {exp.endDate}
                    </p>
                  </div>
                  <ul style={{
                    fontSize: '14px',
                    paddingLeft: '20px',
                    listStyleType: 'disc',
                    lineHeight: '1.6'
                  }}>
                    {exp.description.split('\n').map((bullet, idx) => (
                      bullet.trim() && <li key={idx} style={{ marginBottom: '6px' }}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div style={{ marginBottom: '10px' }}>
              <h3 style={{
                color: colors.heading,
                fontSize: '18px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                marginBottom: '5px',
                paddingBottom: '4px',
                borderBottom: `2px solid ${colors.accent}`
              }}>
                Education
              </h3>
              {education.map((edu, i) => (
                <div key={i} style={{ marginBottom: '5px' }}>
                  <p style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: colors.primary,
                    marginBottom: '4px'
                  }}>
                    {edu.degree}
                  </p>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '2px'
                  }}>
                    {edu.institution}
                  </p>
                  <p style={{
                    fontSize: '13px',
                    color: colors.secondary,
                    marginBottom: '2px',
                    fontStyle: 'italic'
                  }}>
                    {edu.startDate} – {edu.endDate}
                  </p>
                  {edu.specialization && (
                    <p style={{ 
                      fontSize: '13px',
                      color: colors.text
                    }}>
                      <strong>Specialization:</strong> {edu.specialization}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div style={{ marginBottom: '10px' }}>
              <h3 style={{
                color: colors.heading,
                fontSize: '18px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                marginBottom: '12px',
                paddingBottom: '4px',
                borderBottom: `2px solid ${colors.accent}`
              }}>
                Projects
              </h3>
              {projects.map((proj, i) => (
                <div key={i} style={{ marginBottom: '16px' }}>
                  <p style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: colors.primary,
                    marginBottom: '4px'
                  }}>
                    {proj.title}
                  </p>
                  <p style={{
                    fontSize: '14px',
                    lineHeight: '1.6',
                    marginBottom: '6px'
                  }}>
                    {proj.description}
                  </p>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {proj.github && (
                      <a
                        href={proj.github}
                        style={{
                          fontSize: '13px',
                          color: colors.primary,
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <span style={{ marginRight: '4px' }}>🔗</span> GitHub
                      </a>
                    )}
                    {proj.liveDemo && (
                      <a
                        href={proj.liveDemo}
                        style={{
                          fontSize: '13px',
                          color: colors.primary,
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <span style={{ marginRight: '4px' }}>🌐</span> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div style={{ marginBottom: '10px' }}>
              <h3 style={{
                color: colors.heading,
                fontSize: '18px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                marginBottom: '12px',
                paddingBottom: '4px',
                borderBottom: `2px solid ${colors.accent}`
              }}>
                Certifications
              </h3>
              <ul style={{
                fontSize: '14px',
                listStyleType: 'none',
                paddingLeft: '0'
              }}>
                {certifications.map((cert, i) => (
                  <li key={i} style={{ marginBottom: '8px' }}>
                    <p style={{ fontWeight: '500' }}>{cert.title}</p>
                    <p style={{ 
                      fontSize: '13px',
                      color: colors.secondary
                    }}>
                      {cert.issuer} • {cert.year}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default TemplateTwo;

