const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const widgetSwiftContent = `import WidgetKit
import SwiftUI
import ExpoWidgets

@main
struct ExpoWidgetsBundle: WidgetBundle {
  @WidgetBundleBuilder
  var body: some Widget {
    // Expo Widgets will register Live Activities at runtime
    // This empty bundle satisfies the Swift entry point requirement
    ExpoWidgetsProvider.allWidgets()
  }
}
`;

module.exports = function withWidgetEntryPoint(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const widgetTargetPath = path.join(
        config.modRequest.platformProjectRoot,
        'ExpoWidgetsTarget',
        'index.swift'
      );

      // Create directory if it doesn't exist
      const widgetDir = path.dirname(widgetTargetPath);
      if (!fs.existsSync(widgetDir)) {
        fs.mkdirSync(widgetDir, { recursive: true });
      }

      // Always write the proper entry point
      fs.writeFileSync(widgetTargetPath, widgetSwiftContent, 'utf-8');
      console.log('✓ Added Swift entry point to ExpoWidgetsTarget');

      return config;
    },
  ]);
};
