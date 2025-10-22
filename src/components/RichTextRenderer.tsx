import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing } from '../theme';

interface RichTextRendererProps {
  content: string;
  maxLines?: number;
  showMoreText?: string;
  showLessText?: string;
  style?: any;
}

const RichTextRenderer: React.FC<RichTextRendererProps> = ({
  content,
  maxLines = 3,
  showMoreText = 'Show More',
  showLessText = 'Show Less',
  style,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const handleTextLayout = (e: any) => {
    if (!expanded && e.nativeEvent.lines.length > maxLines) {
      setShowButton(true);
    }
  };

  // Simple markdown-like parsing (bold, bullet points, line breaks)
  const renderFormattedText = () => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      // Bullet points
      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return (
          <Text key={index} style={[styles.text, style]}>
            {line}
            {'\n'}
          </Text>
        );
      }
      // Regular text
      return (
        <Text key={index} style={[styles.text, style]}>
          {line}
          {index < lines.length - 1 ? '\n' : ''}
        </Text>
      );
    });
  };

  return (
    <View>
      <Text
        style={[styles.text, style]}
        numberOfLines={expanded ? undefined : maxLines}
        onTextLayout={handleTextLayout}
      >
        {content}
      </Text>
      {showButton && (
        <TouchableOpacity
          onPress={() => setExpanded(!expanded)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            {expanded ? showLessText : showMoreText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    lineHeight: 22,
  },
  button: {
    marginTop: Spacing.sm,
  },
  buttonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
});

export default RichTextRenderer;
