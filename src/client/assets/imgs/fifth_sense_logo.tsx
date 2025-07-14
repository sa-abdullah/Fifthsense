import React from 'react';

const FifthSenseLogo = ({ size = 120, className = '' }) => {
  const eyeWidth = size;
  const eyeHeight = size * 0.5;
  const innerSize = size * 0.33;
  const pupilSize = size * 0.13;

  const containerStyle = {
    width: `${eyeWidth}px`,
    height: `${eyeHeight}px`,
    position: 'relative',
  };

  const eyeOuterStyle = {
    width: `${eyeWidth}px`,
    height: `${eyeHeight}px`,
    background: 'linear-gradient(45deg, #2563eb, #1d4ed8)',
    borderRadius: `${eyeHeight}px`,
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 8px 25px rgba(37, 99, 235, 0.3)',
  };

  const eyeInnerStyle = {
    width: `${innerSize}px`,
    height: `${innerSize}px`,
    background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
    borderRadius: '50%',
    position: 'absolute',
    top: `${(eyeHeight - innerSize) / 2}px`,
    left: `${(eyeWidth - innerSize) / 2}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const pupilStyle = {
    width: `${pupilSize}px`,
    height: `${pupilSize}px`,
    background: 'white',
    borderRadius: '50%',
    animation: 'pulse 1.5s infinite ease-in-out',
    boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
  };

  const circuitLinesStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  };

  const getCircuitLineStyle = (index) => {
    const baseStyle = {
      position: 'absolute',
      background: 'rgba(255,255,255,0.5)',
      borderRadius: '1px',
      animation: `flow 2.5s infinite linear`,
      animationDelay: `${index * 0.8}s`,
    };

    switch (index) {
      case 0:
        return {
          ...baseStyle,
          width: '2px',
          height: `${eyeHeight * 0.4}px`,
          top: `${eyeHeight * 0.25}px`,
          left: `${eyeWidth * 0.125}px`,
        };
      case 1:
        return {
          ...baseStyle,
          width: `${eyeWidth * 0.17}px`,
          height: '2px',
          top: `${eyeHeight * 0.5}px`,
          right: `${eyeWidth * 0.125}px`,
        };
      case 2:
        return {
          ...baseStyle,
          width: '2px',
          height: `${eyeHeight * 0.33}px`,
          bottom: `${eyeHeight * 0.13}px`,
          left: `${eyeWidth * 0.75}px`,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <div className={className}>
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
          }
          25% {
            opacity: 0.8;
            transform: scale(1.15);
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.7);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.3);
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.9);
          }
          75% {
            opacity: 0.8;
            transform: scale(1.15);
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.7);
          }
        }

        @keyframes flow {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(1.2);
          }
        }
      `}</style>
      <div style={containerStyle}>
        <div style={eyeOuterStyle}>
          <div style={eyeInnerStyle}>
            <div style={pupilStyle}></div>
          </div>
          <div style={circuitLinesStyle}>
            {[0, 1, 2].map(index => (
              <div key={index} style={getCircuitLineStyle(index)}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FifthSenseLogo;