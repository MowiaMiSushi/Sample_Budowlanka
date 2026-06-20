import UAParser from 'ua-parser-js';

export const parseUserAgent = (userAgentString) => {
  const parser = new UAParser(userAgentString);
  const result = parser.getResult();

  let deviceType = result.device.type;
  if (!deviceType) {
    if (result.os.name === 'iOS' || result.os.name === 'Android') {
      deviceType = 'mobile';
    } else {
      deviceType = 'desktop';
    }
  }

  deviceType = deviceType.charAt(0).toUpperCase() + deviceType.slice(1);

  return {
    device: {
      type: deviceType,
      vendor: result.device.vendor,
      model: result.device.model
    },
    browser: {
      name: result.browser.name || 'Unknown',
      version: result.browser.version
    },
    os: {
      name: result.os.name || 'Unknown',
      version: result.os.version
    },
    raw: userAgentString
  };
};