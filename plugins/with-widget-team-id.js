const { withXcodeProject } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withWidgetTeamId(config) {
  return withXcodeProject(config, async (config) => {
    const xcodeProject = config.modResults;
    const projectRoot = config.modRequest.platformProjectRoot;
    
    // Get the team ID from the main app target
    const pbxProject = xcodeProject;
    const targets = pbxProject.pbxNativeTargetSection();
    
    let mainAppTeamId = null;
    
    // Find team ID from build configurations
    const buildConfigs = pbxProject.pbxXCBuildConfigurationSection();
    for (const key in buildConfigs) {
      const config = buildConfigs[key];
      if (config.buildSettings && config.buildSettings.DEVELOPMENT_TEAM) {
        mainAppTeamId = config.buildSettings.DEVELOPMENT_TEAM;
        break;
      }
    }
    
    // If we found a team ID, apply it to all configurations
    if (mainAppTeamId) {
      for (const key in buildConfigs) {
        const config = buildConfigs[key];
        if (config.buildSettings && !config.buildSettings.DEVELOPMENT_TEAM) {
          config.buildSettings.DEVELOPMENT_TEAM = mainAppTeamId;
        }
      }
      console.log(`✓ Applied development team ${mainAppTeamId} to all targets`);
    }
    
    return config;
  });
};
