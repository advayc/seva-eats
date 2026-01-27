#!/bin/bash
# Fix the ExpoWidgetsTarget index.swift file to include proper entry point

WIDGET_FILE="ios/ExpoWidgetsTarget/index.swift"

cat > "$WIDGET_FILE" << 'EOF'
import WidgetKit
import SwiftUI

@main
struct ExpoWidgetsBundle: WidgetBundle {
  var body: some Widget {
    EmptyWidget()
  }
}

struct EmptyWidget: Widget {
  let kind: String = "EmptyWidget"
  
  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: EmptyProvider()) { entry in
      EmptyView()
    }
    .supportedFamilies([])
  }
}

struct EmptyProvider: TimelineProvider {
  func placeholder(in context: Context) -> EmptyEntry {
    EmptyEntry(date: Date())
  }
  
  func getSnapshot(in context: Context, completion: @escaping (EmptyEntry) -> ()) {
    completion(EmptyEntry(date: Date()))
  }
  
  func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
    completion(Timeline(entries: [EmptyEntry(date: Date())], policy: .never))
  }
}

struct EmptyEntry: TimelineEntry {
  let date: Date
}
EOF

echo "✓ Fixed ExpoWidgetsTarget entry point"
