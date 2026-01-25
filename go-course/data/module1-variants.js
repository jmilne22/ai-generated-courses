// Auto-generated from module1-variants.json - do not edit directly
// Edit module1-variants.json and run: node build.js
window.moduleData = {
  "conceptLinks": {
    "For Loops": "#lesson-loops",
    "If/Else": "#lesson-if",
    "Slices & Range": "#lesson-slices",
    "Maps": "#lesson-maps",
    "make() Function": "#lesson-slices",
    "Comma-Ok Pattern": "#lesson-comma-ok",
    "Range with Index": "#lesson-loops",
    "Building Slices": "#lesson-slices"
  },
  "sharedContent": {
    "advanced_1": {
      "preReading": {
        "title": "📖 Pre-reading: The \"Have I Seen This?\" Pattern",
        "content": "<strong>The Problem:</strong> How do you know if you've seen something before?<br><br>\n                <strong>Naive approach (slow):</strong><br>\n                For each element, check every other element to see if it matches → O(n²)<br>\n                For 1000 elements, that's 1,000,000 comparisons! 🐌<br><br>\n                <strong>Smart approach (fast):</strong><br>\n                Use a map to remember what you've seen → O(n)<br>\n                For 1000 elements, that's just 1000 operations! 🚀<br><br>\n                <strong>The Pattern:</strong><br>\n                1. Create an empty map to track what you've seen<br>\n                2. For each element, check: \"Have I seen this before?\"<br>\n                3. If yes → found a duplicate!<br>\n                4. If no → remember it and continue"
      },
      "hints": [
        {
          "title": "🤔 Think about it",
          "content": "As you go through the elements, how would you remember which ones you've already seen? What data structure gives you fast lookup to check \"have I seen this before?\""
        },
        {
          "title": "💡 Hint",
          "content": "Use a map as your \"memory\" - the key is the element, and you just need to know it exists (what simple type represents yes/no?). For each element: first check if it's in your memory, then add it if not. If you make it through all elements without finding a duplicate, they must all be unique."
        },
        {
          "title": "🔧 Pattern",
          "content": "<pre>1. Create empty \"seen\" tracker\n2. For each element:\n   - Already in tracker? → found duplicate!\n   - Not seen? → add to tracker\n3. Finished loop? → all unique</pre>"
        }
      ],
      "docLinks": [
        {
          "url": "https://go.dev/blog/maps",
          "title": "Go Blog: Go maps in action",
          "note": "comprehensive guide to maps"
        },
        {
          "url": "https://go.dev/ref/spec#Map_types",
          "title": "Go Spec: Map types",
          "note": "official language specification"
        },
        {
          "url": "https://go.dev/ref/spec#Making_slices_maps_and_channels",
          "title": "Go Spec: make()",
          "note": "how make() initializes maps"
        }
      ]
    },
    "advanced_2": {
      "preReading": {
        "title": "📖 Pre-reading: The Slow/Fast Pointer Pattern",
        "content": "<strong>The Problem:</strong> Remove duplicates from a sorted collection in-place<br><br>\n                <strong>Key insight:</strong> The collection is <strong>sorted</strong>, so duplicates are next to each other!<br><br>\n                <strong>The Slow/Fast Pattern:</strong><br>\n                • <strong>Both pointers start at different positions</strong> (unlike i/j starting at opposite ends)<br>\n                • <strong>They move at different speeds</strong> (unlike i/j both moving every iteration)<br>\n                • One pointer <strong>reads</strong>, the other <strong>writes</strong><br><br>\n                <strong>Code structure pattern:</strong><br>\n<pre>slow := 0  // Initialize OUTSIDE loop (write position)\n\nfor fast := 1; fast < len(items); fast++ {  // Initialize IN loop (read position)\n    // Compare items[fast] with items[slow]\n    // If different: move slow, write value\n    // If same: do nothing\n    // fast moves automatically every iteration\n}</pre>"
      },
      "hints": [
        {
          "title": "🤔 Think about it",
          "content": "If the array is already sorted, where will duplicates be? If you're keeping track of the 'last unique' position, what do you do when you find a new unique value?"
        },
        {
          "title": "💡 Hint",
          "content": "Use two pointers: 'slow' marks where to write the next unique value, 'fast' scans ahead. When fast finds something different from what slow points to, you've found a new unique value - increment slow and copy it there."
        },
        {
          "title": "🔧 Pattern",
          "content": "<pre>1. slow = first position (write pointer)\n2. fast scans from second position (read pointer)\n3. For each fast position:\n   - Different from slow? → advance slow, copy value\n   - Same? → skip (fast moves on)\n4. Return slow + 1 (new length)</pre>"
        }
      ],
      "docLinks": [
        {
          "url": "https://go.dev/ref/spec#For_statements",
          "title": "Go Spec: For statements",
          "note": "loop syntax and semantics"
        },
        {
          "url": "https://go.dev/ref/spec#Slice_types",
          "title": "Go Spec: Slice types",
          "note": "understanding slices"
        },
        {
          "url": "https://go.dev/blog/slices-intro",
          "title": "Go Blog: Arrays, slices, and strings",
          "note": "in-depth slice mechanics"
        }
      ]
    },
    "advanced_3": {
      "preReading": {
        "title": "📖 Pre-reading: Strings vs Runes in Go",
        "content": "<strong>The Problem:</strong> In Go, a <code>string</code> is a sequence of <strong>bytes</strong>, not characters!<br><br>\n                For ASCII (a-z, 0-9), one character = one byte. Easy!<br>\n                But for Unicode (emoji 🎉, Chinese 世界, etc.), one character can be 2-4 bytes.<br><br>\n                <strong>Example:</strong><br>\n                <code>\"Hello\"</code> = 5 bytes = 5 characters ✅<br>\n                <code>\"世界\"</code> = 6 bytes but only 2 characters! ⚠️<br>\n                <code>\"🎉\"</code> = 4 bytes but only 1 character! ⚠️<br><br>\n                <strong>The Solution: Runes</strong><br>\n                A <code>rune</code> is Go's type for a Unicode character (actually an <code>int32</code>).<br>\n                Converting to <code>[]rune</code> splits the string into actual characters, not bytes."
      },
      "hints": [
        {
          "title": "🤔 Think about it",
          "content": "Why can't you just index a string directly with [i]? What's special about strings in Go when dealing with non-ASCII characters?"
        },
        {
          "title": "💡 Hint",
          "content": "Convert to []rune to handle Unicode properly. Then use the two-pointer swap pattern you learned - swap from both ends working inward."
        },
        {
          "title": "🔧 Pattern",
          "content": "<pre>1. Convert string to character array (runes)\n2. Two pointers: left at start, right at end\n3. While left < right:\n   - Swap characters at left and right\n   - Move pointers inward\n4. Convert back to string</pre>"
        }
      ],
      "docLinks": [
        {
          "url": "https://go.dev/blog/strings",
          "title": "Go Blog: Strings, bytes, runes and characters",
          "note": "essential reading for Go strings"
        },
        {
          "url": "https://go.dev/ref/spec#Rune_literals",
          "title": "Go Spec: Rune literals",
          "note": "what runes are"
        },
        {
          "url": "https://pkg.go.dev/unicode",
          "title": "Package unicode",
          "note": "unicode classification functions"
        }
      ]
    },
    "advanced_4": {
      "hints": [
        {
          "title": "🤔 Think about it",
          "content": "What's the pattern for counting things? What data structure lets you track 'how many of each thing' efficiently?"
        },
        {
          "title": "💡 Hint",
          "content": "First split the string into words (check the strings package for a function that splits on whitespace). Then use a map where keys are words and values are counts - what operation increases a map value?"
        },
        {
          "title": "🔧 Pattern",
          "content": "<pre>1. Split string into words\n2. Create empty count tracker (map)\n3. For each word:\n   - Increment its count\n4. Return the counts</pre>"
        }
      ],
      "docLinks": [
        {
          "url": "https://pkg.go.dev/strings",
          "title": "Package strings",
          "note": "Fields, Split, Join and more"
        },
        {
          "url": "https://go.dev/blog/maps",
          "title": "Go Blog: Go maps in action",
          "note": "map operations including increment"
        },
        {
          "url": "https://pkg.go.dev/fmt",
          "title": "Package fmt",
          "note": "printing maps and formatted output"
        }
      ]
    },
    "advanced_5": {
      "preReading": {
        "title": "📖 Pre-reading: The Hash Map Complement Pattern",
        "content": "<strong>The Naive Approach (slow):</strong><br>\n                Check every pair of numbers - requires nested loops O(n²)<br><br>\n                <strong>The Smart Approach (fast):</strong><br>\n                Use a map to remember what you've seen - only one loop O(n)<br><br>\n                <strong>The Key Insight:</strong><br>\n                If target = 9 and current number = 2, we need to find 7.<br>\n                Instead of searching the whole array for 7, just check: \"Have I seen 7 before?\"<br>\n                Maps make this lookup instant!"
      },
      "hints": [
        {
          "title": "🤔 Think about it",
          "content": "For each number, what other number would you need to find to reach the target? Instead of searching the whole array for it, how could you instantly check if you've seen it?"
        },
        {
          "title": "💡 Hint",
          "content": "The complement is <code>target - current</code>. Use a map to remember numbers you've seen AND their indices (since you need to return indices). Check for the complement before adding the current number to your map."
        },
        {
          "title": "🔧 Pattern",
          "content": "<pre>1. Create tracker: number → its index\n2. For each number at position i:\n   - Calculate: complement = target - number\n   - Complement in tracker? → return [tracker[complement], i]\n   - Not found? → add number:i to tracker</pre>"
        }
      ],
      "docLinks": [
        {
          "url": "https://go.dev/blog/maps",
          "title": "Go Blog: Go maps in action",
          "note": "storing values (indices) in maps"
        },
        {
          "url": "https://go.dev/ref/spec#Index_expressions",
          "title": "Go Spec: Index expressions",
          "note": "the comma-ok idiom for map access"
        },
        {
          "url": "https://pkg.go.dev/sort",
          "title": "Package sort",
          "note": "for sorted-input variants"
        }
      ]
    },
    "advanced_6": {
      "preReading": {
        "title": "📖 Pre-reading: The Sliding Window Pattern",
        "content": "<strong>The Problem:</strong> Find something optimal in a contiguous subarray<br><br>\n                <strong>Naive approach (slow):</strong><br>\n                Check every possible subarray - O(n²) or worse 🐌<br><br>\n                <strong>Smart approach (fast):</strong><br>\n                Use a \"window\" that slides through the array - O(n) 🚀<br><br>\n                <strong>Two Types of Sliding Windows:</strong><br>\n                <strong>1. Fixed-size window:</strong> Window size k stays constant<br>\n                • Add the new element entering on the right<br>\n                • Subtract the element leaving on the left<br><br>\n                <strong>2. Variable-size window:</strong> Window grows and shrinks<br>\n                • Expand (move right pointer) to include more elements<br>\n                • Shrink (move left pointer) when condition is violated or met"
      },
      "hints": [
        {
          "title": "🤔 Think about it",
          "content": "If you've already calculated the sum for elements 0-3, do you really need to recalculate everything for elements 1-4? What operation can give you the new sum efficiently?"
        },
        {
          "title": "💡 Hint",
          "content": "For fixed windows: add the new element entering, subtract the element leaving. Think of it as the window 'sliding' right - one element comes in, one goes out. Track your max/min as you slide."
        },
        {
          "title": "🔧 Pattern",
          "content": "<pre>1. Calculate sum of first k elements\n2. Track this as current max\n3. Slide window: for each new position:\n   - Add new element (entering window)\n   - Subtract old element (leaving window)\n   - Update max if current sum is larger</pre>"
        }
      ],
      "docLinks": [
        {
          "url": "https://go.dev/ref/spec#For_statements",
          "title": "Go Spec: For statements",
          "note": "loop constructs"
        },
        {
          "url": "https://go.dev/blog/slices-intro",
          "title": "Go Blog: Slices introduction",
          "note": "slice indexing and sub-slicing"
        },
        {
          "url": "https://pkg.go.dev/builtin#len",
          "title": "Builtin len()",
          "note": "getting slice length"
        }
      ]
    },
    "advanced_7": {
      "preReading": {
        "title": "📖 Pre-reading: The \"Best So Far\" Pattern",
        "content": "<strong>The Problem:</strong> Find the optimal result that depends on pairs of elements where order matters<br><br>\n                <strong>Example:</strong> Best Time to Buy/Sell Stock - you must buy BEFORE you sell<br><br>\n                <strong>Naive approach (slow):</strong><br>\n                Check every pair (i, j) where i < j - O(n²) 🐌<br><br>\n                <strong>Smart approach (fast):</strong><br>\n                Track the \"best so far\" as you scan - O(n) 🚀<br><br>\n                <strong>The Pattern:</strong><br>\n                • Track the minimum (or maximum) seen so far<br>\n                • At each position, calculate the best result using that tracked value<br>\n                • Update your overall best if this result is better<br><br>\n                <strong>Key insight:</strong> You don't need to remember ALL previous values - just the one that matters (min or max)!"
      },
      "hints": [
        {
          "title": "🤔 Think about it",
          "content": "To maximize profit, you want to buy low and sell high. As you scan through prices, what single value from the past do you need to remember to calculate the best possible profit at each day?"
        },
        {
          "title": "💡 Hint",
          "content": "Track the minimum price seen so far. At each day, the best profit you could make is: today's price - minimum so far. Keep track of the maximum profit across all days."
        },
        {
          "title": "🔧 Pattern",
          "content": "<pre>1. Initialize: minSoFar = first element, bestResult = 0\n2. For each element:\n   - Calculate result using minSoFar\n   - Update bestResult if this is better\n   - Update minSoFar if current element is smaller\n3. Return bestResult</pre>"
        }
      ],
      "docLinks": [
        {
          "url": "https://go.dev/ref/spec#Comparison_operators",
          "title": "Go Spec: Comparison operators",
          "note": "< > comparisons"
        },
        {
          "url": "https://go.dev/ref/spec#Arithmetic_operators",
          "title": "Go Spec: Arithmetic operators",
          "note": "subtraction for differences"
        },
        {
          "url": "https://go.dev/ref/spec#If_statements",
          "title": "Go Spec: If statements",
          "note": "conditional updates"
        }
      ]
    }
  },
  "variants": {
    "intermediate": [
      {
        "id": "intermediate_1",
        "concept": "make() Function",
        "variants": [
          {
            "id": "v1",
            "title": "Make and Append to Slice",
            "description": "Create an empty slice using <code>make([]int, 0)</code>, add three numbers with <code>append</code>, then print its length.",
            "hints": [
              "<code>make([]int, 0)</code> creates an empty int slice",
              "<code>nums = append(nums, value)</code> adds to the slice"
            ],
            "solution": "nums := make([]int, 0)\nnums = append(nums, 10)\nnums = append(nums, 20)\nnums = append(nums, 30)\nfmt.Println(len(nums))  // 3",
            "expected": "3"
          },
          {
            "id": "v2",
            "title": "Make an Empty Map",
            "description": "Create an empty map using <code>make(map[string]int)</code>, add three key-value pairs, then print its length.",
            "hints": [
              "<code>make(map[string]int)</code> creates an empty map",
              "<code>scores[\"alice\"] = 100</code> adds a key-value pair"
            ],
            "solution": "scores := make(map[string]int)\nscores[\"alice\"] = 100\nscores[\"bob\"] = 85\nscores[\"carol\"] = 92\nfmt.Println(len(scores))  // 3",
            "expected": "3"
          },
          {
            "id": "v3",
            "title": "Append Multiple Values",
            "description": "Create an empty string slice, then use <code>append</code> to add multiple values at once. Print the slice.",
            "hints": [
              "<code>append</code> can take multiple values: <code>append(slice, a, b, c)</code>"
            ],
            "solution": "words := make([]string, 0)\nwords = append(words, \"go\", \"is\", \"fun\")\nfmt.Println(words)  // [go is fun]",
            "expected": "[go is fun]"
          }
        ]
      },
      {
        "id": "intermediate_2",
        "concept": "Comma-Ok Pattern",
        "variants": [
          {
            "id": "v1",
            "title": "Check Map Key Exists",
            "description": "Create a map of fruit prices. Check if \"banana\" exists using the <code>value, ok := map[key]</code> pattern.",
            "hints": [
              "<code>price, ok := prices[\"banana\"]</code>",
              "<code>ok</code> is true if key exists, false otherwise"
            ],
            "solution": "prices := map[string]float64{\n    \"apple\":  1.50,\n    \"orange\": 2.00,\n}\n\nif price, ok := prices[\"banana\"]; ok {\n    fmt.Printf(\"Banana: $%.2f\\n\", price)\n} else {\n    fmt.Println(\"Banana not found\")\n}",
            "expected": "Banana not found"
          },
          {
            "id": "v2",
            "title": "Safe Map Lookup",
            "description": "Create a map of user ages. Safely look up a user that exists AND one that doesn't, printing appropriate messages.",
            "hints": [
              "Use <code>if age, ok := ages[name]; ok { ... } else { ... }</code>"
            ],
            "solution": "ages := map[string]int{\"alice\": 30, \"bob\": 25}\n\nif age, ok := ages[\"alice\"]; ok {\n    fmt.Printf(\"Alice is %d\\n\", age)\n}\n\nif age, ok := ages[\"charlie\"]; ok {\n    fmt.Printf(\"Charlie is %d\\n\", age)\n} else {\n    fmt.Println(\"Charlie not found\")\n}",
            "expected": "Alice is 30\nCharlie not found"
          },
          {
            "id": "v3",
            "title": "Default Value Pattern",
            "description": "Create a map of stock counts. If an item doesn't exist, print \"Out of stock\" instead of 0.",
            "hints": [
              "Check with comma-ok before using the value"
            ],
            "solution": "stock := map[string]int{\"apple\": 5, \"banana\": 0}\n\nitem := \"orange\"\nif count, ok := stock[item]; ok {\n    fmt.Printf(\"%s: %d in stock\\n\", item, count)\n} else {\n    fmt.Printf(\"%s: Out of stock\\n\", item)\n}",
            "expected": "orange: Out of stock"
          }
        ]
      },
      {
        "id": "intermediate_3",
        "concept": "Range with Index",
        "variants": [
          {
            "id": "v1",
            "title": "Print Index and Value",
            "description": "Create a slice of your favorite foods. Loop through and print both index and value: \"0: pizza\", \"1: tacos\", etc.",
            "hints": [
              "<code>for i, food := range foods</code> gives you both index and value"
            ],
            "solution": "foods := []string{\"pizza\", \"tacos\", \"sushi\"}\nfor i, food := range foods {\n    fmt.Printf(\"%d: %s\\n\", i, food)\n}",
            "expected": "0: pizza\n1: tacos\n2: sushi"
          },
          {
            "id": "v2",
            "title": "Numbered List",
            "description": "Create a slice of task names. Print them as a numbered list starting from 1: \"1. Buy milk\", \"2. Walk dog\", etc.",
            "hints": [
              "Use <code>i+1</code> to start numbering from 1 instead of 0"
            ],
            "solution": "tasks := []string{\"Buy milk\", \"Walk dog\", \"Code\"}\nfor i, task := range tasks {\n    fmt.Printf(\"%d. %s\\n\", i+1, task)\n}",
            "expected": "1. Buy milk\n2. Walk dog\n3. Code"
          },
          {
            "id": "v3",
            "title": "Find Element Index",
            "description": "Create a slice of colors. Find and print the index of \"green\" (or -1 if not found).",
            "hints": [
              "Loop with index, check if element matches"
            ],
            "solution": "colors := []string{\"red\", \"blue\", \"green\", \"yellow\"}\ntarget := \"green\"\nresult := -1\n\nfor i, color := range colors {\n    if color == target {\n        result = i\n        break\n    }\n}\nfmt.Printf(\"Index of %s: %d\\n\", target, result)",
            "expected": "Index of green: 2"
          }
        ]
      },
      {
        "id": "intermediate_4",
        "concept": "Building Slices",
        "variants": [
          {
            "id": "v1",
            "title": "Collect Even Numbers",
            "description": "Create an empty slice, then loop 1-10 and append only even numbers. Print the result.",
            "hints": [
              "Check <code>if i%2 == 0</code>",
              "Use <code>append</code> inside the if block"
            ],
            "solution": "evens := []int{}\nfor i := 1; i <= 10; i++ {\n    if i%2 == 0 {\n        evens = append(evens, i)\n    }\n}\nfmt.Println(evens)",
            "expected": "[2 4 6 8 10]"
          },
          {
            "id": "v2",
            "title": "Filter Long Words",
            "description": "Given <code>[]string{\"go\", \"python\", \"js\", \"rust\"}</code>, collect only words with 3+ characters into a new slice.",
            "hints": [
              "Check <code>if len(word) >= 3</code>"
            ],
            "solution": "words := []string{\"go\", \"python\", \"js\", \"rust\"}\nlong := []string{}\nfor _, word := range words {\n    if len(word) >= 3 {\n        long = append(long, word)\n    }\n}\nfmt.Println(long)",
            "expected": "[python rust]"
          },
          {
            "id": "v3",
            "title": "Collect Multiples of 3",
            "description": "Create an empty slice, loop 1-15, and append only numbers divisible by 3. Print the result.",
            "hints": [
              "Check <code>if i%3 == 0</code>"
            ],
            "solution": "multiples := []int{}\nfor i := 1; i <= 15; i++ {\n    if i%3 == 0 {\n        multiples = append(multiples, i)\n    }\n}\nfmt.Println(multiples)",
            "expected": "[3 6 9 12 15]"
          }
        ]
      },
      {
        "id": "intermediate_5",
        "concept": "String Basics",
        "variants": [
          {
            "id": "v1",
            "title": "String Length and Indexing",
            "description": "Create a string \"Golang\". Print its length, first character, and last character.",
            "hints": [
              "Length: <code>len(s)</code>",
              "First char: <code>s[0]</code> (returns byte)",
              "Last char: <code>s[len(s)-1]</code>"
            ],
            "solution": "s := \"Golang\"\nfmt.Println(len(s))        // 6\nfmt.Printf(\"%c\\n\", s[0])   // G\nfmt.Printf(\"%c\\n\", s[len(s)-1])  // g",
            "expected": "6\nG\ng"
          },
          {
            "id": "v2",
            "title": "Iterate Over String",
            "description": "Create a string \"Hello\". Loop through it and print each character on a new line.",
            "hints": [
              "Use <code>for _, char := range s</code>",
              "Print with <code>fmt.Printf(\"%c\\n\", char)</code>"
            ],
            "solution": "s := \"Hello\"\nfor _, char := range s {\n    fmt.Printf(\"%c\\n\", char)\n}",
            "expected": "H\ne\nl\nl\no"
          },
          {
            "id": "v3",
            "title": "String Concatenation",
            "description": "Create two strings \"Hello\" and \"World\". Concatenate them with a space and print the result.",
            "hints": [
              "Use <code>+</code> to concatenate strings",
              "Or use <code>fmt.Sprintf</code>"
            ],
            "solution": "a := \"Hello\"\nb := \"World\"\nresult := a + \" \" + b\nfmt.Println(result)",
            "expected": "Hello World"
          }
        ]
      },
      {
        "id": "intermediate_6",
        "concept": "Boolean Functions",
        "variants": [
          {
            "id": "v1",
            "title": "Contains Check",
            "description": "Write <code>func contains(nums []int, target int) bool</code> that returns true if target is in the slice.",
            "hints": [
              "Loop through, return true if found",
              "Return false after the loop"
            ],
            "solution": "func contains(nums []int, target int) bool {\n    for _, n := range nums {\n        if n == target {\n            return true\n        }\n    }\n    return false\n}",
            "expected": "true for []int{1,2,3}, 2"
          },
          {
            "id": "v2",
            "title": "All Positive",
            "description": "Write <code>func allPositive(nums []int) bool</code> that returns true only if all numbers are positive (> 0).",
            "hints": [
              "Return false as soon as you find a non-positive",
              "Return true after checking all"
            ],
            "solution": "func allPositive(nums []int) bool {\n    for _, n := range nums {\n        if n <= 0 {\n            return false\n        }\n    }\n    return true\n}",
            "expected": "false for []int{1,2,-3}"
          },
          {
            "id": "v3",
            "title": "Any Even",
            "description": "Write <code>func anyEven(nums []int) bool</code> that returns true if at least one number is even.",
            "hints": [
              "Check <code>n % 2 == 0</code>",
              "Return true as soon as you find one"
            ],
            "solution": "func anyEven(nums []int) bool {\n    for _, n := range nums {\n        if n % 2 == 0 {\n            return true\n        }\n    }\n    return false\n}",
            "expected": "true for []int{1,3,4}"
          }
        ]
      }
    ],
    "warmups": [
      {
        "id": "warmup_1",
        "concept": "For Loops",
        "variants": [
          {
            "id": "v1",
            "title": "Print 1 to 10",
            "description": "Write a program that prints the numbers 1 to 10, one per line.",
            "hints": [
              "Use <code>for i := 1; i <= 10; i++</code>"
            ],
            "solution": "for i := 1; i <= 10; i++ {\n    fmt.Println(i)\n}"
          },
          {
            "id": "v2",
            "title": "Countdown from 5",
            "description": "Write a program that counts down from 5 to 1, then prints \"Go!\"",
            "hints": [
              "Use <code>for i := 5; i >= 1; i--</code>",
              "Print \"Go!\" after the loop"
            ],
            "solution": "for i := 5; i >= 1; i-- {\n    fmt.Println(i)\n}\nfmt.Println(\"Go!\")"
          },
          {
            "id": "v3",
            "title": "Print Even Numbers",
            "description": "Write a program that prints even numbers from 2 to 10.",
            "hints": [
              "Use <code>for i := 2; i <= 10; i += 2</code>"
            ],
            "solution": "for i := 2; i <= 10; i += 2 {\n    fmt.Println(i)\n}"
          }
        ]
      },
      {
        "id": "warmup_2",
        "concept": "If/Else",
        "variants": [
          {
            "id": "v1",
            "title": "Odd or Even",
            "description": "Write <code>func oddOrEven(n int) string</code> that returns \"even\" if n is divisible by 2, else \"odd\".",
            "hints": [
              "Use modulo: <code>if n % 2 == 0</code> means even"
            ],
            "solution": "func oddOrEven(n int) string {\n    if n % 2 == 0 {\n        return \"even\"\n    }\n    return \"odd\"\n}"
          },
          {
            "id": "v2",
            "title": "Pass or Fail",
            "description": "Write <code>func passOrFail(score int) string</code> that returns \"pass\" if score >= 60, else \"fail\".",
            "hints": [
              "Simple if/else: <code>if score >= 60 { return \"pass\" }</code>"
            ],
            "solution": "func passOrFail(score int) string {\n    if score >= 60 {\n        return \"pass\"\n    }\n    return \"fail\"\n}"
          },
          {
            "id": "v3",
            "title": "Temperature Feel",
            "description": "Write <code>func tempFeel(celsius int) string</code> that returns \"freezing\" (< 0), \"cold\" (0-15), \"warm\" (16-25), or \"hot\" (> 25).",
            "hints": [
              "Chain if/else if based on temperature thresholds"
            ],
            "solution": "func tempFeel(celsius int) string {\n    if celsius < 0 {\n        return \"freezing\"\n    } else if celsius <= 15 {\n        return \"cold\"\n    } else if celsius <= 25 {\n        return \"warm\"\n    }\n    return \"hot\"\n}"
          }
        ]
      },
      {
        "id": "warmup_3",
        "concept": "Slices & Range",
        "variants": [
          {
            "id": "v1",
            "title": "Iterate Numbers",
            "description": "Create a slice with three numbers, then print each using <code>for range</code>.",
            "hints": [
              "Create: <code>nums := []int{7, 42, 99}</code>",
              "Loop: <code>for _, num := range nums</code>"
            ],
            "solution": "nums := []int{7, 42, 99}\nfor _, num := range nums {\n    fmt.Println(num)\n}"
          },
          {
            "id": "v2",
            "title": "Iterate with Index",
            "description": "Create a slice of colors, then print each with its index: \"0: red\", \"1: blue\", etc.",
            "hints": [
              "Loop with index: <code>for i, color := range colors</code>",
              "Use <code>fmt.Printf(\"%d: %s\\n\", i, color)</code>"
            ],
            "solution": "colors := []string{\"red\", \"blue\", \"green\"}\nfor i, color := range colors {\n    fmt.Printf(\"%d: %s\\n\", i, color)\n}"
          },
          {
            "id": "v3",
            "title": "Iterate Strings",
            "description": "Create a slice of your favorite foods, print each on its own line.",
            "hints": [
              "Create: <code>foods := []string{\"pizza\", \"sushi\", \"tacos\"}</code>"
            ],
            "solution": "foods := []string{\"pizza\", \"sushi\", \"tacos\"}\nfor _, food := range foods {\n    fmt.Println(food)\n}"
          }
        ]
      },
      {
        "id": "warmup_4",
        "concept": "Maps",
        "variants": [
          {
            "id": "v1",
            "title": "Ages Map",
            "description": "Create a map of names to ages, then print each person's name and age.",
            "hints": [
              "Map syntax: <code>map[string]int{\"alice\": 30}</code>",
              "Loop: <code>for name, age := range ages</code>"
            ],
            "solution": "ages := map[string]int{\n    \"alice\": 30,\n    \"bob\":   25,\n}\nfor name, age := range ages {\n    fmt.Printf(\"%s is %d\\n\", name, age)\n}"
          },
          {
            "id": "v2",
            "title": "Prices Map",
            "description": "Create a map of items to prices (float64), then print each item and price.",
            "hints": [
              "Map syntax: <code>map[string]float64{\"apple\": 1.50}</code>"
            ],
            "solution": "prices := map[string]float64{\n    \"apple\":  1.50,\n    \"banana\": 0.75,\n}\nfor item, price := range prices {\n    fmt.Printf(\"%s: $%.2f\\n\", item, price)\n}"
          },
          {
            "id": "v3",
            "title": "Capitals Map",
            "description": "Create a map of countries to their capitals, then print each pair.",
            "hints": [
              "Map syntax: <code>map[string]string{\"France\": \"Paris\"}</code>"
            ],
            "solution": "capitals := map[string]string{\n    \"France\": \"Paris\",\n    \"Japan\":  \"Tokyo\",\n}\nfor country, capital := range capitals {\n    fmt.Printf(\"%s: %s\\n\", country, capital)\n}"
          }
        ]
      },
      {
        "id": "warmup_5",
        "concept": "Variables & Assignment",
        "variants": [
          {
            "id": "v1",
            "title": "Declare and Print",
            "description": "Declare a variable <code>name</code> with value \"Go\", and an integer <code>year</code> with value 2009. Print both.",
            "hints": [
              "Use short declaration: <code>name := \"Go\"</code>",
              "Use <code>fmt.Println(name, year)</code>"
            ],
            "solution": "name := \"Go\"\nyear := 2009\nfmt.Println(name, year)"
          },
          {
            "id": "v2",
            "title": "Swap Two Variables",
            "description": "Create two variables <code>a := 10</code> and <code>b := 20</code>. Swap their values, then print them.",
            "hints": [
              "Go allows simultaneous assignment: <code>a, b = b, a</code>"
            ],
            "solution": "a := 10\nb := 20\na, b = b, a\nfmt.Println(a, b)  // 20 10"
          },
          {
            "id": "v3",
            "title": "Type Inference",
            "description": "Create variables for your age (int), height (float64), and name (string) using short declaration. Print their values and types.",
            "hints": [
              "Go infers types: <code>age := 25</code> is int",
              "Use <code>fmt.Printf(\"%T\", age)</code> to print type"
            ],
            "solution": "age := 25\nheight := 5.9\nname := \"Alice\"\nfmt.Printf(\"age: %d (%T)\\n\", age, age)\nfmt.Printf(\"height: %.1f (%T)\\n\", height, height)\nfmt.Printf(\"name: %s (%T)\\n\", name, name)"
          }
        ]
      },
      {
        "id": "warmup_6",
        "concept": "Multiple Returns",
        "variants": [
          {
            "id": "v1",
            "title": "Divide with Remainder",
            "description": "Write <code>func divMod(a, b int) (int, int)</code> that returns both quotient and remainder.",
            "hints": [
              "Return two values: <code>return a / b, a % b</code>",
              "Call with: <code>q, r := divMod(10, 3)</code>"
            ],
            "solution": "func divMod(a, b int) (int, int) {\n    return a / b, a % b\n}\n\n// Usage:\nq, r := divMod(10, 3)\nfmt.Println(q, r)  // 3 1"
          },
          {
            "id": "v2",
            "title": "Min and Max",
            "description": "Write <code>func minMax(a, b int) (int, int)</code> that returns the smaller value first, then the larger.",
            "hints": [
              "Use if to compare, then return in order"
            ],
            "solution": "func minMax(a, b int) (int, int) {\n    if a < b {\n        return a, b\n    }\n    return b, a\n}\n\n// Usage:\nsmall, big := minMax(5, 3)\nfmt.Println(small, big)  // 3 5"
          },
          {
            "id": "v3",
            "title": "First and Last",
            "description": "Write <code>func firstLast(s string) (string, string)</code> that returns the first and last character of a string.",
            "hints": [
              "First char: <code>string(s[0])</code>",
              "Last char: <code>string(s[len(s)-1])</code>"
            ],
            "solution": "func firstLast(s string) (string, string) {\n    return string(s[0]), string(s[len(s)-1])\n}\n\n// Usage:\nf, l := firstLast(\"hello\")\nfmt.Println(f, l)  // h o"
          }
        ]
      }
    ],
    "challenges": [
      {
        "id": "challenge_1",
        "block": 1,
        "difficulty": 1,
        "concept": "Accumulator Pattern",
        "docLinks": [
          {
            "url": "https://go.dev/ref/spec#For_statements",
            "title": "Go Spec: For statements",
            "note": "range loops"
          },
          {
            "url": "https://go.dev/ref/spec#Arithmetic_operators",
            "title": "Go Spec: Arithmetic operators",
            "note": "+= syntax"
          }
        ],
        "patternPrimer": {
          "bruteForce": "Loop and update a running result (sum/product/string).",
          "bestApproach": "Initialize the identity value once, then update per element; sometimes early-return is possible.",
          "typical": "Typically O(n) time, O(1) extra space"
        },
        "variants": [
          {
            "id": "v1",
            "title": "Sum of Slice",
            "description": "Write <code>func sum(numbers []int) int</code> that returns the sum of all numbers.",
            "functionSignature": "func sum(numbers []int) int",
            "testCases": [
              {
                "input": "[]int{1, 2, 3, 4, 5}",
                "output": "15"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "As you process each element, you need to build up a result. What variable do you need to track this running total?"
              },
              {
                "title": "💡 Hint",
                "content": "Create an accumulator variable (number for sums, string for joining). Loop through and combine each element with your accumulator."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Start with initial value (0 for sums, \"\" for strings)\n2. For each element:\n   - Combine element with accumulator\n3. Return accumulator</pre>"
              }
            ],
            "solution": "func sum(numbers []int) int {\n    total := 0\n    for _, num := range numbers {\n        total += num\n    }\n    return total\n}"
          },
          {
            "id": "v2",
            "title": "Join Words",
            "description": "Write <code>func joinWords(words []string) string</code> that joins all words with spaces.",
            "functionSignature": "func joinWords(words []string) string",
            "testCases": [
              {
                "input": "[]string{\"go\", \"is\", \"fun\"}",
                "output": "\"go is fun\""
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "As you process each element, you need to build up a result. What variable do you need to track this running total?"
              },
              {
                "title": "💡 Hint",
                "content": "Create an accumulator variable (number for sums, string for joining). Loop through and combine each element with your accumulator."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Start with initial value (0 for sums, \"\" for strings)\n2. For each element:\n   - Combine element with accumulator\n3. Return accumulator</pre>"
              }
            ],
            "solution": "func joinWords(words []string) string {\n    result := \"\"\n    for i, word := range words {\n        if i > 0 {\n            result += \" \"\n        }\n        result += word\n    }\n    return result\n}"
          },
          {
            "id": "v3",
            "title": "Total String Length",
            "description": "Write <code>func totalLength(words []string) int</code> that returns total length of all strings.",
            "functionSignature": "func totalLength(words []string) int",
            "testCases": [
              {
                "input": "[]string{\"go\", \"is\", \"fun\"}",
                "output": "7"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "As you process each element, you need to build up a result. What variable do you need to track this running total?"
              },
              {
                "title": "💡 Hint",
                "content": "Create an accumulator variable (number for sums, string for joining). Loop through and combine each element with your accumulator."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Start with initial value (0 for sums, \"\" for strings)\n2. For each element:\n   - Combine element with accumulator\n3. Return accumulator</pre>"
              }
            ],
            "solution": "func totalLength(words []string) int {\n    total := 0\n    for _, word := range words {\n        total += len(word)\n    }\n    return total\n}"
          },
          {
            "id": "v4",
            "title": "Product of Slice",
            "description": "Write <code>func product(nums []int) int</code> that returns the product of all numbers (multiply them together).",
            "functionSignature": "func product(nums []int) int",
            "testCases": [
              { "input": "[]int{2, 3, 4}", "output": "24" },
              { "input": "[]int{5, 2, 1}", "output": "10" }
            ],
            "hints": [
              { "title": "🤔 Think about it", "content": "Like sum, but multiply. What should your starting value be? (Hint: not 0!)" },
              { "title": "💡 Hint", "content": "Start with result := 1 (identity for multiplication). Multiply each element into the accumulator." },
              { "title": "🔧 Pattern", "content": "<pre>1. Start with result := 1\n2. For each element:\n   - result *= element\n3. Return result</pre>" }
            ],
            "solution": "func product(nums []int) int {\n    result := 1\n    for _, n := range nums {\n        result *= n\n    }\n    return result\n}"
          },
          {
            "id": "v5",
            "title": "Running Balance",
            "description": "Write <code>func balance(transactions []int) int</code> where positive numbers are deposits, negative are withdrawals. Return final balance.",
            "functionSignature": "func balance(transactions []int) int",
            "testCases": [
              { "input": "[]int{100, -30, 50, -20}", "output": "100", "note": "100 - 30 + 50 - 20 = 100" },
              { "input": "[]int{-10, 20, -5}", "output": "5" }
            ],
            "hints": [
              { "title": "🤔 Think about it", "content": "This is just a sum! Positive and negative numbers handle themselves." },
              { "title": "💡 Hint", "content": "Start with balance := 0. Add each transaction (negatives will subtract automatically)." },
              { "title": "🔧 Pattern", "content": "<pre>1. Start with balance := 0\n2. For each transaction:\n   - balance += transaction\n3. Return balance</pre>" }
            ],
            "solution": "func balance(transactions []int) int {\n    bal := 0\n    for _, t := range transactions {\n        bal += t\n    }\n    return bal\n}"
          },
          {
            "id": "v6",
            "title": "Concat All",
            "description": "Write <code>func concatAll(words []string) string</code> that concatenates all strings with no separator.",
            "functionSignature": "func concatAll(words []string) string",
            "testCases": [
              { "input": "[]string{\"a\", \"b\", \"c\"}", "output": "\"abc\"" },
              { "input": "[]string{\"Go\", \"Lang\"}", "output": "\"GoLang\"" }
            ],
            "hints": [
              { "title": "🤔 Think about it", "content": "Build up a string by adding each word to the end." },
              { "title": "💡 Hint", "content": "Start with result := \"\". For each word, result += word." },
              { "title": "🔧 Pattern", "content": "<pre>1. Start with result := \"\"\n2. For each word:\n   - result += word\n3. Return result</pre>" }
            ],
            "solution": "func concatAll(words []string) string {\n    result := \"\"\n    for _, w := range words {\n        result += w\n    }\n    return result\n}"
          }
        ]
      },
      {
        "id": "challenge_2",
        "block": 1,
        "difficulty": 1,
        "concept": "Conditional Counter",
        "docLinks": [
          {
            "url": "https://go.dev/ref/spec#If_statements",
            "title": "Go Spec: If statements",
            "note": "conditionals"
          },
          {
            "url": "https://go.dev/ref/spec#Arithmetic_operators",
            "title": "Go Spec: Arithmetic operators",
            "note": "% modulo operator"
          }
        ],
        "patternPrimer": {
          "bruteForce": "Loop through, check condition for each element, increment counter.",
          "bestApproach": "Same approach - this is already optimal! Just loop once and count matches.",
          "typical": "Typically O(n) time, O(1) extra space"
        },
        "variants": [
          {
            "id": "v1",
            "title": "Count Evens",
            "description": "Write <code>func countEvens(nums []int) int</code> that counts even numbers.",
            "functionSignature": "func countEvens(nums []int) int",
            "testCases": [
              {
                "input": "[]int{1, 2, 3, 4, 5, 6}",
                "output": "3"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "You need to count things that meet a condition. What two pieces do you need: one to track the count, and one to check each element?"
              },
              {
                "title": "💡 Hint",
                "content": "Start a counter at 0. For each element, check your condition - if true, increment the counter."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Start counter at 0\n2. For each element:\n   - Meets condition? → increment counter\n3. Return counter</pre>"
              }
            ],
            "solution": "func countEvens(nums []int) int {\n    count := 0\n    for _, num := range nums {\n        if num%2 == 0 {\n            count++\n        }\n    }\n    return count\n}"
          },
          {
            "id": "v2",
            "title": "Count Negatives",
            "description": "Write <code>func countNegatives(nums []int) int</code> that counts negative numbers.",
            "functionSignature": "func countNegatives(nums []int) int",
            "testCases": [
              {
                "input": "[]int{-1, 2, -3, 4}",
                "output": "2"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "You need to count things that meet a condition. What two pieces do you need: one to track the count, and one to check each element?"
              },
              {
                "title": "💡 Hint",
                "content": "Start a counter at 0. For each element, check your condition - if true, increment the counter."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Start counter at 0\n2. For each element:\n   - Meets condition? → increment counter\n3. Return counter</pre>"
              }
            ],
            "solution": "func countNegatives(nums []int) int {\n    count := 0\n    for _, num := range nums {\n        if num < 0 {\n            count++\n        }\n    }\n    return count\n}"
          },
          {
            "id": "v3",
            "title": "Count Passing Scores",
            "description": "Write <code>func countPassing(scores []int, threshold int) int</code> that counts scores >= threshold.",
            "functionSignature": "func countPassing(scores []int, threshold int) int",
            "testCases": [
              {
                "input": "[]int{55, 72, 68, 90, 45}, 60",
                "output": "3"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "You need to count things that meet a condition. What two pieces do you need: one to track the count, and one to check each element?"
              },
              {
                "title": "💡 Hint",
                "content": "Start a counter at 0. For each element, check your condition - if true, increment the counter."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Start counter at 0\n2. For each element:\n   - Meets condition? → increment counter\n3. Return counter</pre>"
              }
            ],
            "solution": "func countPassing(scores []int, threshold int) int {\n    count := 0\n    for _, score := range scores {\n        if score >= threshold {\n            count++\n        }\n    }\n    return count\n}"
          },
          {
            "id": "v4",
            "title": "Count Divisible By",
            "description": "Write <code>func countDivisible(nums []int, d int) int</code> that counts numbers divisible by d.",
            "functionSignature": "func countDivisible(nums []int, d int) int",
            "testCases": [
              { "input": "[]int{3, 6, 7, 9, 12}, 3", "output": "4", "note": "3, 6, 9, 12 are divisible by 3" },
              { "input": "[]int{1, 2, 3, 4, 5}, 2", "output": "2" }
            ],
            "hints": [
              { "title": "🤔 Think about it", "content": "How do you check if a number is divisible by another? What operation gives you the remainder?" },
              { "title": "💡 Hint", "content": "Use the modulo operator: num % d == 0 means num is divisible by d." },
              { "title": "🔧 Pattern", "content": "<pre>1. count := 0\n2. For each num:\n   - num % d == 0? → count++\n3. Return count</pre>" }
            ],
            "solution": "func countDivisible(nums []int, d int) int {\n    count := 0\n    for _, n := range nums {\n        if n % d == 0 { count++ }\n    }\n    return count\n}"
          },
          {
            "id": "v5",
            "title": "Count Long Words",
            "description": "Write <code>func countLongWords(words []string, minLen int) int</code> that counts words with length >= minLen.",
            "functionSignature": "func countLongWords(words []string, minLen int) int",
            "testCases": [
              { "input": "[]string{\"go\", \"python\", \"rust\", \"c\"}, 4", "output": "2", "note": "python and rust have len >= 4" },
              { "input": "[]string{\"a\", \"ab\", \"abc\"}, 2", "output": "2" }
            ],
            "hints": [
              { "title": "🤔 Think about it", "content": "Same counting pattern, just checking string length instead of numeric value." },
              { "title": "💡 Hint", "content": "Use len(word) >= minLen as your condition." },
              { "title": "🔧 Pattern", "content": "<pre>1. count := 0\n2. For each word:\n   - len(word) >= minLen? → count++\n3. Return count</pre>" }
            ],
            "solution": "func countLongWords(words []string, minLen int) int {\n    count := 0\n    for _, w := range words {\n        if len(w) >= minLen { count++ }\n    }\n    return count\n}"
          },
          {
            "id": "v6",
            "title": "Count In Range",
            "description": "Write <code>func countInRange(nums []int, min, max int) int</code> that counts numbers where min <= num <= max.",
            "functionSignature": "func countInRange(nums []int, min, max int) int",
            "testCases": [
              { "input": "[]int{1, 5, 10, 15, 20}, 5, 15", "output": "3", "note": "5, 10, 15 are in range" },
              { "input": "[]int{1, 2, 3, 4, 5}, 2, 4", "output": "3" }
            ],
            "hints": [
              { "title": "🤔 Think about it", "content": "You need to check TWO conditions: num >= min AND num <= max." },
              { "title": "💡 Hint", "content": "Combine conditions with &&: if num >= min && num <= max." },
              { "title": "🔧 Pattern", "content": "<pre>1. count := 0\n2. For each num:\n   - num >= min && num <= max? → count++\n3. Return count</pre>" }
            ],
            "solution": "func countInRange(nums []int, min, max int) int {\n    count := 0\n    for _, n := range nums {\n        if n >= min && n <= max { count++ }\n    }\n    return count\n}"
          }
        ]
      },
      {
        "id": "challenge_3",
        "block": 1,
        "difficulty": 1,
        "concept": "Branching Logic",
        "docLinks": [
          {
            "url": "https://go.dev/ref/spec#If_statements",
            "title": "Go Spec: If statements",
            "note": "else-if chains"
          },
          {
            "url": "https://go.dev/ref/spec#Comparison_operators",
            "title": "Go Spec: Comparison operators",
            "note": ">=, <, == etc."
          }
        ],
        "variants": [
          {
            "id": "v1",
            "title": "FizzBuzz",
            "description": "Print 1-20. Multiples of 3: \"Fizz\", 5: \"Buzz\", both: \"FizzBuzz\".",
            "functionSignature": "// loop",
            "testCases": [
              {
                "input": "15",
                "output": "FizzBuzz"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "When you have overlapping conditions (like a number divisible by both 3 AND 5), which case should you check first?"
              },
              {
                "title": "💡 Hint",
                "content": "Check the most specific condition first! For FizzBuzz, 15 is divisible by both 3 and 5, so check for 15 before checking 3 or 5 individually."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Check most specific condition first\n2. Then check less specific conditions\n3. Default case last\n(Order matters: check \"both 3 AND 5\" before \"just 3\" or \"just 5\")</pre>"
              }
            ],
            "solution": "for i := 1; i <= 20; i++ {\n    if i%15 == 0 {\n        fmt.Println(\"FizzBuzz\")\n    } else if i%3 == 0 {\n        fmt.Println(\"Fizz\")\n    } else if i%5 == 0 {\n        fmt.Println(\"Buzz\")\n    } else {\n        fmt.Println(i)\n    }\n}"
          },
          {
            "id": "v2",
            "title": "Grade Classifier",
            "description": "Write <code>func grade(score int) string</code> returning A/B/C/D/F.",
            "functionSignature": "func grade(score int) string",
            "testCases": [
              {
                "input": "85",
                "output": "\"B\""
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "When you have overlapping conditions (like a number divisible by both 3 AND 5), which case should you check first?"
              },
              {
                "title": "💡 Hint",
                "content": "Check the most specific condition first! For FizzBuzz, 15 is divisible by both 3 and 5, so check for 15 before checking 3 or 5 individually."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Check most specific condition first\n2. Then check less specific conditions\n3. Default case last\n(Order matters: check \"both 3 AND 5\" before \"just 3\" or \"just 5\")</pre>"
              }
            ],
            "solution": "func grade(score int) string {\n    if score >= 90 { return \"A\" }\n    if score >= 80 { return \"B\" }\n    if score >= 70 { return \"C\" }\n    if score >= 60 { return \"D\" }\n    return \"F\"\n}"
          },
          {
            "id": "v3",
            "title": "Age Category",
            "description": "Write <code>func ageCategory(age int) string</code> returning \"infant\" (0-1), \"toddler\" (2-3), \"child\" (4-12), \"teen\" (13-19), or \"adult\" (20+).",
            "functionSignature": "func ageCategory(age int) string",
            "testCases": [
              {
                "input": "15",
                "output": "\"teen\""
              },
              {
                "input": "2",
                "output": "\"toddler\""
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "When you have multiple age ranges to check, what order should you check them in to avoid incorrect matches?"
              },
              {
                "title": "💡 Hint",
                "content": "Check ranges in ascending order using upper bounds. If age <= 1, it's infant. If age <= 3, it's toddler. And so on."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Check ranges in order from youngest to oldest\n2. Use upper bounds (<=) for each category\n3. Default to \"adult\" for 20+</pre>"
              }
            ],
            "solution": "func ageCategory(age int) string {\n    if age <= 1 { return \"infant\" }\n    if age <= 3 { return \"toddler\" }\n    if age <= 12 { return \"child\" }\n    if age <= 19 { return \"teen\" }\n    return \"adult\"\n}"
          },
          {
            "id": "v4",
            "title": "Number Sign",
            "description": "Write <code>func sign(n int) string</code> returning \"positive\", \"negative\", or \"zero\".",
            "functionSignature": "func sign(n int) string",
            "testCases": [
              { "input": "5", "output": "\"positive\"" },
              { "input": "-3", "output": "\"negative\"" },
              { "input": "0", "output": "\"zero\"" }
            ],
            "hints": [
              { "title": "🤔 Think about it", "content": "Three cases: greater than 0, less than 0, or equal to 0." },
              { "title": "💡 Hint", "content": "Check n > 0, then n < 0, else it's zero." },
              { "title": "🔧 Pattern", "content": "<pre>if n > 0 { return \"positive\" }\nif n < 0 { return \"negative\" }\nreturn \"zero\"</pre>" }
            ],
            "solution": "func sign(n int) string {\n    if n > 0 { return \"positive\" }\n    if n < 0 { return \"negative\" }\n    return \"zero\"\n}"
          },
          {
            "id": "v5",
            "title": "Ticket Price",
            "description": "Write <code>func ticketPrice(age int) int</code>: children (0-12) pay 5, teens (13-17) pay 8, adults (18-64) pay 12, seniors (65+) pay 7.",
            "functionSignature": "func ticketPrice(age int) int",
            "testCases": [
              { "input": "10", "output": "5" },
              { "input": "15", "output": "8" },
              { "input": "30", "output": "12" },
              { "input": "70", "output": "7" }
            ],
            "hints": [
              { "title": "🤔 Think about it", "content": "Multiple age ranges with different prices. Check from youngest to oldest." },
              { "title": "💡 Hint", "content": "Use if-else chain checking upper bounds: <= 12, <= 17, <= 64, else senior." },
              { "title": "🔧 Pattern", "content": "<pre>if age <= 12 { return 5 }\nif age <= 17 { return 8 }\nif age <= 64 { return 12 }\nreturn 7</pre>" }
            ],
            "solution": "func ticketPrice(age int) int {\n    if age <= 12 { return 5 }\n    if age <= 17 { return 8 }\n    if age <= 64 { return 12 }\n    return 7\n}"
          },
          {
            "id": "v6",
            "title": "Shipping Cost",
            "description": "Write <code>func shippingCost(weight int) int</code>: 0-1kg costs 5, 2-5kg costs 10, 6-10kg costs 20, over 10kg costs 50.",
            "functionSignature": "func shippingCost(weight int) int",
            "testCases": [
              { "input": "1", "output": "5" },
              { "input": "3", "output": "10" },
              { "input": "8", "output": "20" },
              { "input": "15", "output": "50" }
            ],
            "hints": [
              { "title": "🤔 Think about it", "content": "Multiple weight brackets. Check from lightest to heaviest." },
              { "title": "💡 Hint", "content": "Check upper bounds: <= 1, <= 5, <= 10, else heavy." },
              { "title": "🔧 Pattern", "content": "<pre>if weight <= 1 { return 5 }\nif weight <= 5 { return 10 }\nif weight <= 10 { return 20 }\nreturn 50</pre>" }
            ],
            "solution": "func shippingCost(weight int) int {\n    if weight <= 1 { return 5 }\n    if weight <= 5 { return 10 }\n    if weight <= 10 { return 20 }\n    return 50\n}"
          }
        ]
      },
      {
        "id": "challenge_4",
        "block": 1,
        "difficulty": 1,
        "concept": "Finding Extrema",
        "docLinks": [
          {
            "url": "https://go.dev/ref/spec#Index_expressions",
            "title": "Go Spec: Index expressions",
            "note": "accessing slice elements"
          },
          {
            "url": "https://pkg.go.dev/builtin#len",
            "title": "Builtin len()",
            "note": "string and slice length"
          }
        ],
        "patternPrimer": {
          "bruteForce": "Track the current best value; update whenever you find a better one.",
          "bestApproach": "Same approach - initialize to first element, then compare each subsequent element.",
          "typical": "Typically O(n) time, O(1) extra space"
        },
        "variants": [
          {
            "id": "v1",
            "title": "Find Maximum",
            "description": "Write <code>func max(nums []int) int</code> that returns the largest number.",
            "functionSignature": "func max(nums []int) int",
            "testCases": [
              {
                "input": "[]int{3, 7, 2, 9}",
                "output": "9"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "If you want to track the 'best so far', what's a reasonable starting value? Hint: what if the first element is the answer?"
              },
              {
                "title": "💡 Hint",
                "content": "Initialize with the first element (not 0 or some arbitrary value). Compare each subsequent element - if it's better, update your best."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Start with first element as \"best so far\"\n2. For each remaining element:\n   - Better than current best? → update best\n3. Return best</pre>"
              }
            ],
            "solution": "func max(nums []int) int {\n    m := nums[0]\n    for _, n := range nums {\n        if n > m { m = n }\n    }\n    return m\n}"
          },
          {
            "id": "v2",
            "title": "Find Minimum",
            "description": "Write <code>func min(nums []int) int</code> that returns the smallest number.",
            "functionSignature": "func min(nums []int) int",
            "testCases": [
              {
                "input": "[]int{3, 7, 2, 9}",
                "output": "2"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "If you want to track the 'best so far', what's a reasonable starting value? Hint: what if the first element is the answer?"
              },
              {
                "title": "💡 Hint",
                "content": "Initialize with the first element (not 0 or some arbitrary value). Compare each subsequent element - if it's better, update your best."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Start with first element as \"best so far\"\n2. For each remaining element:\n   - Better than current best? → update best\n3. Return best</pre>"
              }
            ],
            "solution": "func min(nums []int) int {\n    m := nums[0]\n    for _, n := range nums {\n        if n < m { m = n }\n    }\n    return m\n}"
          },
          {
            "id": "v3",
            "title": "Longest String",
            "description": "Write <code>func longest(words []string) string</code> that returns the longest word.",
            "functionSignature": "func longest(words []string) string",
            "testCases": [
              {
                "input": "[]string{\"go\", \"python\"}",
                "output": "\"python\""
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "If you want to track the 'best so far', what's a reasonable starting value? Hint: what if the first element is the answer?"
              },
              {
                "title": "💡 Hint",
                "content": "Initialize with the first element (not 0 or some arbitrary value). Compare each subsequent element - if it's better, update your best."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Start with first element as \"best so far\"\n2. For each remaining element:\n   - Better than current best? → update best\n3. Return best</pre>"
              }
            ],
            "solution": "func longest(words []string) string {\n    r := words[0]\n    for _, w := range words {\n        if len(w) > len(r) { r = w }\n    }\n    return r\n}"
          },
          {
            "id": "v4",
            "title": "Shortest String",
            "description": "Write <code>func shortest(words []string) string</code> that returns the shortest word.",
            "functionSignature": "func shortest(words []string) string",
            "testCases": [
              {
                "input": "[]string{\"go\", \"python\", \"java\"}",
                "output": "\"go\""
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "If you want to track the 'best so far', what's a reasonable starting value? Hint: what if the first element is the answer?"
              },
              {
                "title": "💡 Hint",
                "content": "Initialize with the first element. Compare each subsequent element - if it's shorter, update your best."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Start with first element as \"best so far\"\n2. For each remaining element:\n   - Shorter than current best? → update best\n3. Return best</pre>"
              }
            ],
            "solution": "func shortest(words []string) string {\n    r := words[0]\n    for _, w := range words {\n        if len(w) < len(r) { r = w }\n    }\n    return r\n}"
          },
          {
            "id": "v5",
            "title": "Second Largest",
            "description": "Write <code>func secondLargest(nums []int) int</code> that returns the second largest number. Assume at least 2 distinct numbers.",
            "functionSignature": "func secondLargest(nums []int) int",
            "testCases": [
              {
                "input": "[]int{5, 1, 9, 3}",
                "output": "5"
              },
              {
                "input": "[]int{10, 10, 8, 5}",
                "output": "8"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "You need to track TWO values: the best so far AND the second best. When should each one update?"
              },
              {
                "title": "💡 Hint",
                "content": "Track first and second. When you find a new max, the old max becomes second. When you find something bigger than second but smaller than first, that becomes the new second."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Initialize first and second with smallest possible values\n2. For each element:\n   - Bigger than first? → second = first, first = element\n   - Bigger than second (and != first)? → second = element\n3. Return second</pre>"
              }
            ],
            "solution": "func secondLargest(nums []int) int {\n    first, second := nums[0], nums[1]\n    if second > first { first, second = second, first }\n    for _, n := range nums[2:] {\n        if n > first { second, first = first, n\n        } else if n > second && n != first { second = n }\n    }\n    return second\n}"
          },
          {
            "id": "v6",
            "title": "Smallest Positive",
            "description": "Write <code>func smallestPositive(nums []int) int</code> that returns the smallest positive number, or -1 if none exist.",
            "functionSignature": "func smallestPositive(nums []int) int",
            "testCases": [
              {
                "input": "[]int{-5, 3, -1, 7, 2}",
                "output": "2"
              },
              {
                "input": "[]int{-3, -1, 0}",
                "output": "-1"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "You need to find an extrema (minimum) but with a condition (must be positive). What's tricky about initializing the 'best so far'?"
              },
              {
                "title": "💡 Hint",
                "content": "You can't initialize with nums[0] if it might not be positive. Either find the first positive to initialize, or use a flag to track if you've found any positive."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Initialize result to -1 (not found)\n2. For each element:\n   - Is positive AND (first positive OR smaller than result)?\n   → update result\n3. Return result</pre>"
              }
            ],
            "solution": "func smallestPositive(nums []int) int {\n    result := -1\n    for _, n := range nums {\n        if n > 0 && (result == -1 || n < result) {\n            result = n\n        }\n    }\n    return result\n}"
          }
        ]
      },
      {
        "id": "challenge_5",
        "block": 2,
        "difficulty": 2,
        "concept": "Filter with Append",
        "docLinks": [
          {
            "url": "https://pkg.go.dev/builtin#append",
            "title": "Builtin append()",
            "note": "growing slices dynamically"
          },
          {
            "url": "https://go.dev/blog/slices-intro",
            "title": "Go Blog: Slices introduction",
            "note": "slice internals"
          }
        ],
        "patternPrimer": {
          "bruteForce": "Create a new slice and append elements that pass the condition.",
          "bestApproach": "Same approach - loop once, append conditionally. Can't do better than O(n).",
          "typical": "Typically O(n) time, O(k) extra space where k = filtered elements"
        },
        "variants": [
          {
            "id": "v1",
            "title": "Filter Positives",
            "description": "Write <code>func filterPositives(nums []int) []int</code> returning only positive numbers.",
            "functionSignature": "func filterPositives(nums []int) []int",
            "testCases": [
              {
                "input": "[]int{-2, 3, -1, 5}",
                "output": "[3, 5]"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "You want to build a new collection containing only some elements. What do you start with, and how do you add elements that pass your test?"
              },
              {
                "title": "💡 Hint",
                "content": "Start with an empty slice. Loop through, check your condition, and append elements that pass."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Start with empty result collection\n2. For each element:\n   - Passes test? → add to result\n3. Return result</pre>"
              }
            ],
            "solution": "func filterPositives(nums []int) []int {\n    r := []int{}\n    for _, n := range nums {\n        if n > 0 { r = append(r, n) }\n    }\n    return r\n}"
          },
          {
            "id": "v2",
            "title": "Filter Evens",
            "description": "Write <code>func filterEvens(nums []int) []int</code> returning only even numbers.",
            "functionSignature": "func filterEvens(nums []int) []int",
            "testCases": [
              {
                "input": "[]int{1, 2, 3, 4}",
                "output": "[2, 4]"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "You want to build a new collection containing only some elements. What do you start with, and how do you add elements that pass your test?"
              },
              {
                "title": "💡 Hint",
                "content": "Start with an empty slice. Loop through, check your condition, and append elements that pass."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Start with empty result collection\n2. For each element:\n   - Passes test? → add to result\n3. Return result</pre>"
              }
            ],
            "solution": "func filterEvens(nums []int) []int {\n    r := []int{}\n    for _, n := range nums {\n        if n%2 == 0 { r = append(r, n) }\n    }\n    return r\n}"
          },
          {
            "id": "v3",
            "title": "Filter Short Words",
            "description": "Write <code>func filterShort(words []string, max int) []string</code> returning words with len <= max.",
            "functionSignature": "func filterShort(words []string, max int) []string",
            "testCases": [
              {
                "input": "[]string{\"go\", \"python\"}, 3",
                "output": "[\"go\"]"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "You want to build a new collection containing only some elements. What do you start with, and how do you add elements that pass your test?"
              },
              {
                "title": "💡 Hint",
                "content": "Start with an empty slice. Loop through, check your condition, and append elements that pass."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Start with empty result collection\n2. For each element:\n   - Passes test? → add to result\n3. Return result</pre>"
              }
            ],
            "solution": "func filterShort(words []string, max int) []string {\n    r := []string{}\n    for _, w := range words {\n        if len(w) <= max { r = append(r, w) }\n    }\n    return r\n}"
          },
          {
            "id": "v4",
            "title": "Filter Greater Than",
            "description": "Write <code>func filterGreater(nums []int, threshold int) []int</code> returning only numbers greater than threshold.",
            "functionSignature": "func filterGreater(nums []int, threshold int) []int",
            "testCases": [
              {
                "input": "[]int{1, 5, 3, 8, 2}, 3",
                "output": "[5, 8]"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "You want to build a new collection containing only some elements. What do you start with, and how do you add elements that pass your test?"
              },
              {
                "title": "💡 Hint",
                "content": "Start with an empty slice. Loop through, check if n > threshold, and append elements that pass."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Start with empty result slice\n2. For each element:\n   - Passes test? → append to result\n3. Return result</pre>"
              }
            ],
            "solution": "func filterGreater(nums []int, threshold int) []int {\n    r := []int{}\n    for _, n := range nums {\n        if n > threshold { r = append(r, n) }\n    }\n    return r\n}"
          },
          {
            "id": "v5",
            "title": "Filter Non-Empty",
            "description": "Write <code>func filterNonEmpty(words []string) []string</code> returning only non-empty strings.",
            "functionSignature": "func filterNonEmpty(words []string) []string",
            "testCases": [
              {
                "input": "[]string{\"go\", \"\", \"python\", \"\"}",
                "output": "[\"go\", \"python\"]"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "You want to filter out empty strings. How do you check if a string is empty?"
              },
              {
                "title": "💡 Hint",
                "content": "Check if len(w) > 0 or equivalently w != \"\". Append only strings that pass this test."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Start with empty result slice\n2. For each element:\n   - Not empty? → append to result\n3. Return result</pre>"
              }
            ],
            "solution": "func filterNonEmpty(words []string) []string {\n    r := []string{}\n    for _, w := range words {\n        if w != \"\" { r = append(r, w) }\n    }\n    return r\n}"
          },
          {
            "id": "v6",
            "title": "Filter In Range",
            "description": "Write <code>func filterInRange(nums []int, min, max int) []int</code> returning numbers where min <= n <= max.",
            "functionSignature": "func filterInRange(nums []int, min, max int) []int",
            "testCases": [
              {
                "input": "[]int{1, 5, 3, 8, 2}, 2, 5",
                "output": "[5, 3, 2]"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "You need to check TWO conditions: the number must be >= min AND <= max."
              },
              {
                "title": "💡 Hint",
                "content": "Use n >= min && n <= max as your filter condition. Only append elements that satisfy both conditions."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Start with empty result slice\n2. For each element:\n   - In range [min, max]? → append to result\n3. Return result</pre>"
              }
            ],
            "solution": "func filterInRange(nums []int, min, max int) []int {\n    r := []int{}\n    for _, n := range nums {\n        if n >= min && n <= max { r = append(r, n) }\n    }\n    return r\n}"
          }
        ]
      },
      {
        "id": "challenge_6",
        "block": 2,
        "difficulty": 2,
        "concept": "Find Index",
        "docLinks": [
          {
            "url": "https://go.dev/ref/spec#For_statements",
            "title": "Go Spec: For statements",
            "note": "range with index"
          },
          {
            "url": "https://go.dev/ref/spec#Return_statements",
            "title": "Go Spec: Return statements",
            "note": "early returns"
          }
        ],
        "patternPrimer": {
          "bruteForce": "Loop through, return index immediately when found; return -1 if not found.",
          "bestApproach": "Same approach - early return is already optimal! No need to continue after finding match.",
          "typical": "Typically O(n) time worst case, O(1) if found early, O(1) extra space"
        },
        "variants": [
          {
            "id": "v1",
            "title": "Find Index",
            "description": "Write <code>func findIndex(nums []int, target int) int</code> returning index or -1.",
            "functionSignature": "func findIndex(nums []int, target int) int",
            "testCases": [
              {
                "input": "[]int{10, 20, 30}, 20",
                "output": "1"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "If you're looking for something specific, when should you stop looking? What should you return if you never find it?"
              },
              {
                "title": "💡 Hint",
                "content": "Loop with the index variable. When you find a match, return that index immediately (early return). If the loop completes without finding anything, return -1."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. For each element with its index:\n   - Matches target? → return index immediately\n2. Loop finished? → return -1 (not found)</pre>"
              }
            ],
            "solution": "func findIndex(nums []int, target int) int {\n    for i, n := range nums {\n        if n == target { return i }\n    }\n    return -1\n}"
          },
          {
            "id": "v2",
            "title": "Find Word",
            "description": "Write <code>func findWord(words []string, target string) int</code> returning index or -1.",
            "functionSignature": "func findWord(words []string, target string) int",
            "testCases": [
              {
                "input": "[]string{\"go\", \"py\"}, \"py\"",
                "output": "1"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "If you're looking for something specific, when should you stop looking? What should you return if you never find it?"
              },
              {
                "title": "💡 Hint",
                "content": "Loop with the index variable. When you find a match, return that index immediately (early return). If the loop completes without finding anything, return -1."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. For each element with its index:\n   - Matches target? → return index immediately\n2. Loop finished? → return -1 (not found)</pre>"
              }
            ],
            "solution": "func findWord(words []string, target string) int {\n    for i, w := range words {\n        if w == target { return i }\n    }\n    return -1\n}"
          },
          {
            "id": "v3",
            "title": "First Negative Index",
            "description": "Write <code>func firstNegIdx(nums []int) int</code> returning index of first negative or -1.",
            "functionSignature": "func firstNegIdx(nums []int) int",
            "testCases": [
              {
                "input": "[]int{5, -2, 3}",
                "output": "1"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "If you're looking for something specific, when should you stop looking? What should you return if you never find it?"
              },
              {
                "title": "💡 Hint",
                "content": "Loop with the index variable. When you find a match, return that index immediately (early return). If the loop completes without finding anything, return -1."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. For each element with its index:\n   - Matches target? → return index immediately\n2. Loop finished? → return -1 (not found)</pre>"
              }
            ],
            "solution": "func firstNegIdx(nums []int) int {\n    for i, n := range nums {\n        if n < 0 { return i }\n    }\n    return -1\n}"
          },
          {
            "id": "v4",
            "title": "Find First Even",
            "description": "Write <code>func firstEvenIdx(nums []int) int</code> returning the index of the first even number, or -1 if none.",
            "functionSignature": "func firstEvenIdx(nums []int) int",
            "testCases": [
              {
                "input": "[]int{1, 3, 4, 5}",
                "output": "2"
              },
              {
                "input": "[]int{1, 3, 5}",
                "output": "-1"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "How do you check if a number is even? Use the modulo operator."
              },
              {
                "title": "💡 Hint",
                "content": "Check if n % 2 == 0. If so, return that index immediately. Otherwise keep looking."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. For each element with its index:\n   - Is even (n % 2 == 0)? → return index\n2. Loop finished? → return -1 (not found)</pre>"
              }
            ],
            "solution": "func firstEvenIdx(nums []int) int {\n    for i, n := range nums {\n        if n % 2 == 0 { return i }\n    }\n    return -1\n}"
          },
          {
            "id": "v5",
            "title": "Last Index Of",
            "description": "Write <code>func lastIndex(nums []int, target int) int</code> returning the LAST index where target appears, or -1.",
            "functionSignature": "func lastIndex(nums []int, target int) int",
            "testCases": [
              {
                "input": "[]int{1, 2, 3, 2, 1}, 2",
                "output": "3"
              },
              {
                "input": "[]int{1, 2, 3}, 5",
                "output": "-1"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "Unlike finding the FIRST match (where you return immediately), for the LAST match you need to keep track of matches as you go."
              },
              {
                "title": "💡 Hint",
                "content": "Initialize result to -1. Each time you find a match, update result to that index. After the loop, return result."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Initialize result := -1\n2. For each element with its index:\n   - Matches target? → result = index\n3. Return result (last match, or -1)</pre>"
              }
            ],
            "solution": "func lastIndex(nums []int, target int) int {\n    result := -1\n    for i, n := range nums {\n        if n == target { result = i }\n    }\n    return result\n}"
          },
          {
            "id": "v6",
            "title": "Find Long Word Index",
            "description": "Write <code>func findLongWordIdx(words []string, minLen int) int</code> returning the index of first word with length >= minLen, or -1.",
            "functionSignature": "func findLongWordIdx(words []string, minLen int) int",
            "testCases": [
              {
                "input": "[]string{\"go\", \"hi\", \"python\"}, 4",
                "output": "2"
              },
              {
                "input": "[]string{\"a\", \"bb\"}, 5",
                "output": "-1"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "Instead of matching an exact value, you're matching a condition (length >= minLen)."
              },
              {
                "title": "💡 Hint",
                "content": "Check if len(w) >= minLen. If so, return that index immediately. Otherwise keep looking."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. For each word with its index:\n   - Long enough? → return index\n2. Loop finished? → return -1 (not found)</pre>"
              }
            ],
            "solution": "func findLongWordIdx(words []string, minLen int) int {\n    for i, w := range words {\n        if len(w) >= minLen { return i }\n    }\n    return -1\n}"
          }
        ]
      },
      {
        "id": "challenge_7",
        "block": 2,
        "difficulty": 2,
        "concept": "Frequency Map",
        "docLinks": [
          {
            "url": "https://go.dev/blog/maps",
            "title": "Go Blog: Go maps in action",
            "note": "map operations"
          },
          {
            "url": "https://go.dev/ref/spec#Making_slices_maps_and_channels",
            "title": "Go Spec: make()",
            "note": "creating maps"
          }
        ],
        "patternPrimer": {
          "bruteForce": "Nested loops: for each unique element, scan the entire array again to count occurrences.",
          "bestApproach": "Single pass with a map, incrementing counts[element]++ as we go. Map automatically tracks unique keys.",
          "typical": "Typically O(n) time, O(n) extra space"
        },
        "variants": [
          {
            "id": "v1",
            "title": "Count Occurrences",
            "description": "Write <code>func countOccurrences(nums []int) map[int]int</code>.",
            "functionSignature": "func countOccurrences(nums []int) map[int]int",
            "testCases": [
              {
                "input": "[]int{1, 2, 2, 3, 3, 3}",
                "output": "map[1:1 2:2 3:3]"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "You want to count how many times each element appears. What data structure maps 'thing' to 'count of that thing'?"
              },
              {
                "title": "💡 Hint",
                "content": "Use a map where keys are the elements and values are counts. The magic: accessing a non-existent key returns 0, so you can just do counts[item]++ even for the first occurrence."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Create empty count map\n2. For each element:\n   - Increment count for that element\n3. Return map</pre>"
              }
            ],
            "solution": "func countOccurrences(nums []int) map[int]int {\n    c := make(map[int]int)\n    for _, n := range nums { c[n]++ }\n    return c\n}"
          },
          {
            "id": "v2",
            "title": "Count Characters",
            "description": "Write <code>func countChars(s string) map[rune]int</code>.",
            "functionSignature": "func countChars(s string) map[rune]int",
            "testCases": [
              {
                "input": "\"hello\"",
                "output": "map[e:1 h:1 l:2 o:1]"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "You want to count how many times each element appears. What data structure maps 'thing' to 'count of that thing'?"
              },
              {
                "title": "💡 Hint",
                "content": "Use a map where keys are the elements and values are counts. The magic: accessing a non-existent key returns 0, so you can just do counts[item]++ even for the first occurrence."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Create empty count map\n2. For each element:\n   - Increment count for that element\n3. Return map</pre>"
              }
            ],
            "solution": "func countChars(s string) map[rune]int {\n    c := make(map[rune]int)\n    for _, r := range s { c[r]++ }\n    return c\n}"
          },
          {
            "id": "v3",
            "title": "Word Frequency",
            "description": "Write <code>func wordFreq(words []string) map[string]int</code>.",
            "functionSignature": "func wordFreq(words []string) map[string]int",
            "testCases": [
              {
                "input": "[]string{\"go\", \"go\", \"py\"}",
                "output": "map[go:2 py:1]"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "You want to count how many times each element appears. What data structure maps 'thing' to 'count of that thing'?"
              },
              {
                "title": "💡 Hint",
                "content": "Use a map where keys are the elements and values are counts. The magic: accessing a non-existent key returns 0, so you can just do counts[item]++ even for the first occurrence."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Create empty count map\n2. For each element:\n   - Increment count for that element\n3. Return map</pre>"
              }
            ],
            "solution": "func wordFreq(words []string) map[string]int {\n    c := make(map[string]int)\n    for _, w := range words { c[w]++ }\n    return c\n}"
          },
          {
            "id": "v4",
            "title": "Count Even and Odd",
            "description": "Write <code>func countEvenOdd(nums []int) map[string]int</code> returning a map with keys \"even\" and \"odd\" showing how many of each.",
            "functionSignature": "func countEvenOdd(nums []int) map[string]int",
            "testCases": [
              {
                "input": "[]int{1, 2, 3, 4, 5}",
                "output": "map[even:2 odd:3]"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "Similar to counting positives/negatives, but now store the counts in a map instead of separate variables."
              },
              {
                "title": "💡 Hint",
                "content": "Use num % 2 to check: if it equals 0, the number is even. Increment the appropriate key in your map."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Create empty count map\n2. For each element:\n   - Is it even (num % 2 == 0)? → increment \"even\"\n   - Otherwise → increment \"odd\"\n3. Return map</pre>"
              }
            ],
            "solution": "func countEvenOdd(nums []int) map[string]int {\n    c := make(map[string]int)\n    for _, n := range nums {\n        if n % 2 == 0 { c[\"even\"]++ } else { c[\"odd\"]++ }\n    }\n    return c\n}"
          },
          {
            "id": "v5",
            "title": "Invert Count Map",
            "description": "Write <code>func invertCounts(counts map[string]int) map[int][]string</code> that inverts a frequency map. Keys become values grouped by their original values.",
            "functionSignature": "func invertCounts(counts map[string]int) map[int][]string",
            "testCases": [
              {
                "input": "map[string]int{\"a\": 2, \"b\": 1, \"c\": 2}",
                "output": "map[1:[b] 2:[a c]]",
                "note": "words with count 1: [b], words with count 2: [a, c]"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "You're flipping the relationship: instead of word→count, you want count→[words with that count]."
              },
              {
                "title": "💡 Hint",
                "content": "Loop through the original map. For each key-value pair, append the key to the slice stored at the value in your new map."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Create result map[int][]string\n2. For each word, count in original:\n   - Append word to result[count]\n3. Return result</pre>"
              }
            ],
            "solution": "func invertCounts(counts map[string]int) map[int][]string {\n    result := make(map[int][]string)\n    for word, count := range counts {\n        result[count] = append(result[count], word)\n    }\n    return result\n}"
          },
          {
            "id": "v6",
            "title": "Count by Length",
            "description": "Write <code>func countByLength(words []string) map[int]int</code> that groups words by their length and counts how many words are in each group. Keys are lengths, values are counts.",
            "functionSignature": "func countByLength(words []string) map[int]int",
            "testCases": [
              {
                "input": "[]string{\"go\", \"rust\", \"c\", \"js\"}",
                "output": "map[1:1 2:2 4:1]",
                "note": "1 word of length 1 (c), 2 words of length 2 (go, js), 1 word of length 4 (rust)"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "Instead of counting the words themselves, you're counting a property of each word. What property? Its length."
              },
              {
                "title": "💡 Hint",
                "content": "Use len(word) as the key. Same counting pattern, just using the length instead of the word itself."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Create empty count map\n2. For each word:\n   - Get its length with len(word)\n   - Increment count for that length\n3. Return map</pre>"
              }
            ],
            "solution": "func countByLength(words []string) map[int]int {\n    c := make(map[int]int)\n    for _, w := range words { c[len(w)]++ }\n    return c\n}"
          },
          {
            "id": "v7",
            "title": "Count by Remainder",
            "description": "Write <code>func countByRemainder(nums []int, divisor int) map[int]int</code> that groups numbers by their remainder when divided by divisor.",
            "functionSignature": "func countByRemainder(nums []int, divisor int) map[int]int",
            "testCases": [
              { "input": "[]int{1, 2, 3, 4, 5, 6}, 3", "output": "map[0:2 1:2 2:2]", "note": "3,6 have remainder 0; 1,4 have remainder 1; 2,5 have remainder 2" },
              { "input": "[]int{10, 20, 30}, 10", "output": "map[0:3]" }
            ],
            "hints": [
              { "title": "🤔 Think about it", "content": "The key is num % divisor (the remainder). Count how many numbers give each remainder." },
              { "title": "💡 Hint", "content": "Same counting pattern as before, but use num % divisor as the key." },
              { "title": "🔧 Pattern", "content": "<pre>1. Create empty count map\n2. For each num:\n   - remainder := num % divisor\n   - counts[remainder]++\n3. Return counts</pre>" }
            ],
            "solution": "func countByRemainder(nums []int, divisor int) map[int]int {\n    c := make(map[int]int)\n    for _, n := range nums { c[n % divisor]++ }\n    return c\n}"
          },
          {
            "id": "v8",
            "title": "Group by First Letter",
            "description": "Write <code>func countByFirstLetter(words []string) map[string]int</code> that counts how many words start with each letter. Use lowercase keys.",
            "functionSignature": "func countByFirstLetter(words []string) map[string]int",
            "testCases": [
              { "input": "[]string{\"apple\", \"ant\", \"bear\", \"ace\"}", "output": "map[a:3 b:1]" },
              { "input": "[]string{\"Go\", \"great\", \"Python\"}", "output": "map[g:2 p:1]", "note": "lowercase keys" }
            ],
            "hints": [
              { "title": "🤔 Think about it", "content": "Extract the first character of each word and use it as the key. How do you get the first character of a string?" },
              { "title": "💡 Hint", "content": "Use strings.ToLower(string(word[0])) to get the lowercase first letter as a string. Then count like before." },
              { "title": "🔧 Pattern", "content": "<pre>1. Create empty count map\n2. For each word:\n   - Get first letter (lowercase)\n   - Increment count for that letter\n3. Return map</pre>" }
            ],
            "solution": "func countByFirstLetter(words []string) map[string]int {\n    c := make(map[string]int)\n    for _, w := range words {\n        if len(w) > 0 {\n            first := strings.ToLower(string(w[0]))\n            c[first]++\n        }\n    }\n    return c\n}"
          }
        ]
      },
      {
        "id": "challenge_8",
        "block": 3,
        "difficulty": 3,
        "concept": "Swap Pattern",
        "docLinks": [
          {
            "url": "https://go.dev/ref/spec#Assignments",
            "title": "Go Spec: Assignments",
            "note": "tuple assignment (a, b = b, a)"
          },
          {
            "url": "https://go.dev/ref/spec#Index_expressions",
            "title": "Go Spec: Index expressions",
            "note": "slice indexing"
          }
        ],
        "patternPrimer": {
          "bruteForce": "Use a temp variable: temp = a, a = b, b = temp (three operations).",
          "bestApproach": "Go's simultaneous assignment: a, b = b, a (evaluates right side first, then assigns).",
          "typical": "Typically O(1) time, O(1) extra space"
        },
        "variants": [
          {
            "id": "v1",
            "title": "Swap Elements",
            "description": "Write <code>func swap(nums []int, i, j int)</code> that swaps elements at i and j.",
            "functionSignature": "func swap(nums []int, i, j int)",
            "testCases": [
              {
                "input": "[]int{1,2,3}, 0, 2",
                "output": "[3,2,1]"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "How do you swap two values without losing one of them? Think about what happens if you just write a = b."
              },
              {
                "title": "💡 Hint",
                "content": "Go has a special syntax for simultaneous assignment: a, b = b, a. This evaluates the right side first, then assigns, so nothing is lost."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Simultaneous assignment: left, right = right, left\n(Both sides evaluated before assignment - nothing lost!)</pre>"
              }
            ],
            "solution": "func swap(nums []int, i, j int) {\n    nums[i], nums[j] = nums[j], nums[i]\n}"
          },
          {
            "id": "v2",
            "title": "Swap Using Temp",
            "description": "Write <code>func swapWithTemp(nums []int, i, j int)</code> that swaps elements using a temporary variable (not Go's simultaneous assignment).",
            "functionSignature": "func swapWithTemp(nums []int, i, j int)",
            "testCases": [
              {
                "input": "[]int{1,2,3,4}, 0, 3",
                "output": "[4,2,3,1]"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "The classic 3-step swap: save one value, overwrite it, then use the saved value."
              },
              {
                "title": "💡 Hint",
                "content": "temp := nums[i], then nums[i] = nums[j], then nums[j] = temp."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. temp := nums[i]  // save first value\n2. nums[i] = nums[j]  // overwrite with second\n3. nums[j] = temp  // put saved value in second spot</pre>"
              }
            ],
            "solution": "func swapWithTemp(nums []int, i, j int) {\n    temp := nums[i]\n    nums[i] = nums[j]\n    nums[j] = temp\n}"
          },
          {
            "id": "v3",
            "title": "Swap Adjacent Pairs",
            "description": "Write <code>func swapPairs(nums []int)</code> that swaps elements at indices 0&1, 2&3, 4&5, etc. If odd length, last element stays.",
            "functionSignature": "func swapPairs(nums []int)",
            "testCases": [
              {
                "input": "[]int{1,2,3,4,5}",
                "output": "[2,1,4,3,5]"
              },
              {
                "input": "[]int{1,2,3,4}",
                "output": "[2,1,4,3]"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "How do you swap two values without losing one of them? Think about what happens if you just write a = b."
              },
              {
                "title": "💡 Hint",
                "content": "Loop through the slice incrementing by 2 each time. Use Go's simultaneous assignment to swap pairs: nums[i], nums[i+1] = nums[i+1], nums[i]."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Loop with i += 2\n2. Check i+1 < len to avoid out of bounds\n3. Swap: nums[i], nums[i+1] = nums[i+1], nums[i]</pre>"
              }
            ],
            "solution": "func swapPairs(nums []int) {\n    for i := 0; i+1 < len(nums); i += 2 {\n        nums[i], nums[i+1] = nums[i+1], nums[i]\n    }\n}"
          },
          {
            "id": "v4",
            "title": "Swap First Two",
            "description": "Write <code>func swapFirstTwo(nums []int)</code> that swaps the elements at index 0 and index 1. Assume slice has at least 2 elements.",
            "functionSignature": "func swapFirstTwo(nums []int)",
            "testCases": [
              {
                "input": "[]int{1,2,3,4}",
                "output": "[2,1,3,4]"
              },
              {
                "input": "[]int{5,10}",
                "output": "[10,5]"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "This is just one swap - no loop needed. What indices do you need?"
              },
              {
                "title": "💡 Hint",
                "content": "Swap nums[0] and nums[1] using simultaneous assignment."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>nums[0], nums[1] = nums[1], nums[0]</pre>"
              }
            ],
            "solution": "func swapFirstTwo(nums []int) {\n    nums[0], nums[1] = nums[1], nums[0]\n}"
          },
          {
            "id": "v5",
            "title": "Swap Middle Two",
            "description": "Write <code>func swapMiddle(nums []int)</code> that swaps the two middle elements. Assume even length.",
            "functionSignature": "func swapMiddle(nums []int)",
            "testCases": [
              {
                "input": "[]int{1,2,3,4}",
                "output": "[1,3,2,4]"
              },
              {
                "input": "[]int{10,20,30,40,50,60}",
                "output": "[10,20,40,30,50,60]"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "For a slice of length n, the two middle elements are at indices n/2-1 and n/2."
              },
              {
                "title": "💡 Hint",
                "content": "Calculate mid := len(nums)/2. Then swap nums[mid-1] and nums[mid]."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>mid := len(nums) / 2\nnums[mid-1], nums[mid] = nums[mid], nums[mid-1]</pre>"
              }
            ],
            "solution": "func swapMiddle(nums []int) {\n    mid := len(nums) / 2\n    nums[mid-1], nums[mid] = nums[mid], nums[mid-1]\n}"
          },
          {
            "id": "v6",
            "title": "Swap at Offset",
            "description": "Write <code>func swapAtOffset(nums []int, k int)</code> that swaps element at index k with element at index len-1-k (mirror positions from each end).",
            "functionSignature": "func swapAtOffset(nums []int, k int)",
            "testCases": [
              {
                "input": "[]int{1,2,3,4,5}, 1",
                "output": "[1,4,3,2,5]",
                "note": "swaps index 1 with index 3"
              },
              {
                "input": "[]int{1,2,3,4,5}, 0",
                "output": "[5,2,3,4,1]",
                "note": "swaps index 0 with index 4 (same as swapEnds)"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "The mirror position of index k from the start is len-1-k from the end."
              },
              {
                "title": "💡 Hint",
                "content": "Swap nums[k] with nums[len(nums)-1-k]."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>nums[k], nums[len(nums)-1-k] = nums[len(nums)-1-k], nums[k]</pre>"
              }
            ],
            "solution": "func swapAtOffset(nums []int, k int) {\n    nums[k], nums[len(nums)-1-k] = nums[len(nums)-1-k], nums[k]\n}"
          },
          {
            "id": "v7",
            "title": "Swap Min and Max",
            "description": "Write <code>func swapMinMax(nums []int)</code> that finds the minimum and maximum elements and swaps their positions.",
            "functionSignature": "func swapMinMax(nums []int)",
            "testCases": [
              {
                "input": "[]int{3,1,4,1,5}",
                "output": "[3,5,4,1,1]"
              },
              {
                "input": "[]int{5,2,8,1}",
                "output": "[5,2,1,8]"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "First you need to find WHERE the min and max are (their indices), then swap the elements at those positions."
              },
              {
                "title": "💡 Hint",
                "content": "Track minIdx and maxIdx as you loop. Start with both at 0. Update minIdx when you find a smaller value, maxIdx when you find a larger value. Then swap at the end."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Initialize minIdx = 0, maxIdx = 0\n2. Loop through slice:\n   - nums[i] < nums[minIdx]? → minIdx = i\n   - nums[i] > nums[maxIdx]? → maxIdx = i\n3. Swap: nums[minIdx], nums[maxIdx] = nums[maxIdx], nums[minIdx]</pre>"
              }
            ],
            "solution": "func swapMinMax(nums []int) {\n    minIdx, maxIdx := 0, 0\n    for i := range nums {\n        if nums[i] < nums[minIdx] { minIdx = i }\n        if nums[i] > nums[maxIdx] { maxIdx = i }\n    }\n    nums[minIdx], nums[maxIdx] = nums[maxIdx], nums[minIdx]\n}"
          },
          {
            "id": "v8",
            "title": "Rotate Left by One",
            "description": "Write <code>func rotateLeft(nums []int)</code> that shifts all elements one position left, wrapping the first element to the end. E.g., [1,2,3,4] → [2,3,4,1].",
            "functionSignature": "func rotateLeft(nums []int)",
            "testCases": [
              {
                "input": "[]int{1,2,3,4}",
                "output": "[2,3,4,1]"
              },
              {
                "input": "[]int{5,10,15}",
                "output": "[10,15,5]"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "You need to save the first element, shift everything left, then put the saved element at the end."
              },
              {
                "title": "💡 Hint",
                "content": "Save first := nums[0]. Loop from i=0 to len-2, copying nums[i+1] to nums[i]. Finally set nums[len-1] = first."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Save first element: first := nums[0]\n2. Shift elements left: for i := 0; i < len-1; i++ → nums[i] = nums[i+1]\n3. Place first at end: nums[len-1] = first</pre>"
              }
            ],
            "solution": "func rotateLeft(nums []int) {\n    if len(nums) == 0 { return }\n    first := nums[0]\n    for i := 0; i < len(nums)-1; i++ {\n        nums[i] = nums[i+1]\n    }\n    nums[len(nums)-1] = first\n}"
          },
          {
            "id": "v9",
            "title": "Swap Halves",
            "description": "Write <code>func swapHalves(nums []int)</code> that swaps the first half with the second half. For [1,2,3,4] → [3,4,1,2]. Assume even length.",
            "functionSignature": "func swapHalves(nums []int)",
            "testCases": [
              {
                "input": "[]int{1,2,3,4}",
                "output": "[3,4,1,2]"
              },
              {
                "input": "[]int{10,20,30,40,50,60}",
                "output": "[40,50,60,10,20,30]"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "You need to swap element 0 with element n/2, element 1 with element n/2+1, etc. How many swaps is that?"
              },
              {
                "title": "💡 Hint",
                "content": "Loop from i=0 to len/2. Each iteration swaps nums[i] with nums[i + len/2]."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Calculate mid := len(nums) / 2\n2. Loop i from 0 to mid:\n   - Swap nums[i] with nums[i + mid]\n</pre>"
              }
            ],
            "solution": "func swapHalves(nums []int) {\n    mid := len(nums) / 2\n    for i := 0; i < mid; i++ {\n        nums[i], nums[i+mid] = nums[i+mid], nums[i]\n    }\n}"
          },
          {
            "id": "v10",
            "title": "Bubble Up",
            "description": "Write <code>func bubbleUp(nums []int, idx int)</code> that 'bubbles' the element at idx towards the front by swapping with its left neighbor until it reaches index 0.",
            "functionSignature": "func bubbleUp(nums []int, idx int)",
            "testCases": [
              { "input": "[]int{1,2,3,4}, 3", "output": "[4,1,2,3]", "note": "4 bubbles from idx 3 to idx 0" },
              { "input": "[]int{5,10,15}, 1", "output": "[10,5,15]", "note": "10 bubbles from idx 1 to idx 0" }
            ],
            "hints": [
              { "title": "🤔 Think about it", "content": "Start at idx and work backwards to 0, swapping adjacent elements each step." },
              { "title": "💡 Hint", "content": "Loop from idx down to 1: for i := idx; i > 0; i--. Each iteration swap nums[i] with nums[i-1]." },
              { "title": "🔧 Pattern", "content": "<pre>1. for i := idx; i > 0; i--\n2.   swap nums[i] and nums[i-1]\n(Element 'bubbles' left one position each iteration)</pre>" }
            ],
            "solution": "func bubbleUp(nums []int, idx int) {\n    for i := idx; i > 0; i-- {\n        nums[i], nums[i-1] = nums[i-1], nums[i]\n    }\n}"
          },
          {
            "id": "v11",
            "title": "Swap If Out of Order",
            "description": "Write <code>func swapIfGreater(nums []int, i, j int)</code> that swaps elements at i and j only if nums[i] > nums[j]. This is a building block for sorting!",
            "functionSignature": "func swapIfGreater(nums []int, i, j int)",
            "testCases": [
              { "input": "[]int{5,2,8,1}, 0, 1", "output": "[2,5,8,1]", "note": "5 > 2, so swap" },
              { "input": "[]int{1,5,3,4}, 0, 1", "output": "[1,5,3,4]", "note": "1 < 5, no swap" }
            ],
            "hints": [
              { "title": "🤔 Think about it", "content": "Check if the first element is greater. If yes, swap. If no, do nothing." },
              { "title": "💡 Hint", "content": "Use an if statement: if nums[i] > nums[j], then do the swap." },
              { "title": "🔧 Pattern", "content": "<pre>if nums[i] > nums[j] {\n    nums[i], nums[j] = nums[j], nums[i]\n}</pre>" }
            ],
            "solution": "func swapIfGreater(nums []int, i, j int) {\n    if nums[i] > nums[j] {\n        nums[i], nums[j] = nums[j], nums[i]\n    }\n}"
          },
          {
            "id": "v12",
            "title": "Move to Front",
            "description": "Write <code>func moveToFront(nums []int, idx int)</code> that moves the element at idx to the front, shifting other elements right. E.g., [1,2,3,4] with idx=2 → [3,1,2,4].",
            "functionSignature": "func moveToFront(nums []int, idx int)",
            "testCases": [
              { "input": "[]int{1,2,3,4}, 2", "output": "[3,1,2,4]" },
              { "input": "[]int{10,20,30,40}, 3", "output": "[40,10,20,30]" }
            ],
            "hints": [
              { "title": "🤔 Think about it", "content": "Save the element at idx. Shift elements from 0 to idx-1 one position right. Put saved element at front." },
              { "title": "💡 Hint", "content": "Save val := nums[idx]. Loop backwards from idx down to 1, copying nums[i-1] to nums[i]. Set nums[0] = val." },
              { "title": "🔧 Pattern", "content": "<pre>1. Save element: val := nums[idx]\n2. Shift right: for i := idx; i > 0; i-- → nums[i] = nums[i-1]\n3. Place at front: nums[0] = val</pre>" }
            ],
            "solution": "func moveToFront(nums []int, idx int) {\n    val := nums[idx]\n    for i := idx; i > 0; i-- {\n        nums[i] = nums[i-1]\n    }\n    nums[0] = val\n}"
          }
        ]
      },
      {
        "id": "challenge_9",
        "block": 3,
        "difficulty": 3,
        "concept": "Two-Pointer Comparison",
        "docLinks": [
          {
            "url": "https://go.dev/ref/spec#For_statements",
            "title": "Go Spec: For statements",
            "note": "two-variable initialization (i, j := ...)"
          },
          {
            "url": "https://go.dev/ref/spec#Comparison_operators",
            "title": "Go Spec: Comparison operators",
            "note": "!= for mismatch detection"
          }
        ],
        "patternPrimer": {
          "bruteForce": "Create a reversed copy of the array, then compare element-by-element with the original.",
          "bestApproach": "Compare from both ends simultaneously, moving inward; stop as soon as mismatch found.",
          "typical": "Typically O(n) time, O(1) extra space"
        },
        "variants": [
          {
            "id": "v1",
            "title": "Palindrome Check",
            "description": "Write <code>func isPalindrome(nums []int) bool</code> - same forwards/backwards.",
            "functionSignature": "func isPalindrome(nums []int) bool",
            "testCases": [
              {
                "input": "[]int{1,2,3,2,1}",
                "output": "true"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "To check if something reads the same forwards and backwards, where should you start comparing? Do you need to check every element?"
              },
              {
                "title": "💡 Hint",
                "content": "Compare from both ends moving inward. Start with pointers at index 0 and len-1. If any pair doesn't match, it's not a palindrome. If you make it to the middle without mismatches, it is."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. left pointer at start, right pointer at end\n2. While left < right:\n   - Compare elements at both pointers\n   - Mismatch? → return false\n   - Move both pointers inward\n3. Return true (all pairs matched)</pre>"
              }
            ],
            "solution": "func isPalindrome(nums []int) bool {\n    for i, j := 0, len(nums)-1; i < j; i, j = i+1, j-1 {\n        if nums[i] != nums[j] { return false }\n    }\n    return true\n}"
          },
          {
            "id": "v2",
            "title": "String Palindrome",
            "description": "Write <code>func isSymmetric(s string) bool</code>.",
            "functionSignature": "func isSymmetric(s string) bool",
            "testCases": [
              {
                "input": "\"racecar\"",
                "output": "true"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "To check if something reads the same forwards and backwards, where should you start comparing? Do you need to check every element?"
              },
              {
                "title": "💡 Hint",
                "content": "Compare from both ends moving inward. Start with pointers at index 0 and len-1. If any pair doesn't match, it's not a palindrome. If you make it to the middle without mismatches, it is."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. left pointer at start, right pointer at end\n2. While left < right:\n   - Compare elements at both pointers\n   - Mismatch? → return false\n   - Move both pointers inward\n3. Return true (all pairs matched)</pre>"
              }
            ],
            "solution": "func isSymmetric(s string) bool {\n    r := []rune(s)\n    for i, j := 0, len(r)-1; i < j; i, j = i+1, j-1 {\n        if r[i] != r[j] { return false }\n    }\n    return true\n}"
          },
          {
            "id": "v3",
            "title": "Is Sorted Ascending",
            "description": "Write <code>func isSorted(nums []int) bool</code> - true if each element <= the next.",
            "functionSignature": "func isSorted(nums []int) bool",
            "testCases": [
              {
                "input": "[]int{1,2,3,4}",
                "output": "true"
              },
              {
                "input": "[]int{1,3,2,4}",
                "output": "false"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "To verify sorted order, what pairs of elements do you need to compare? Do you need to compare every element to every other element?"
              },
              {
                "title": "💡 Hint",
                "content": "Check adjacent pairs: compare nums[i] with nums[i+1]. If any pair is out of order (nums[i] > nums[i+1]), return false immediately."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Loop through indices 0 to len-2\n2. Compare each element with the next\n3. If nums[i] > nums[i+1] → return false\n4. Return true (all pairs in order)</pre>"
              }
            ],
            "solution": "func isSorted(nums []int) bool {\n    for i := 0; i < len(nums)-1; i++ {\n        if nums[i] > nums[i+1] { return false }\n    }\n    return true\n}"
          },
          {
            "id": "v4",
            "title": "Has Adjacent Duplicates",
            "description": "Write <code>func hasAdjacentDups(nums []int) bool</code> - true if any two adjacent elements are equal.",
            "functionSignature": "func hasAdjacentDups(nums []int) bool",
            "testCases": [
              {
                "input": "[]int{1, 2, 2, 3}",
                "output": "true"
              },
              {
                "input": "[]int{1, 2, 3, 4}",
                "output": "false"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "You need to compare each element with its neighbor. What pairs should you check?"
              },
              {
                "title": "💡 Hint",
                "content": "Loop through indices 0 to len-2. Compare nums[i] with nums[i+1]. If they're equal, you found adjacent duplicates."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Loop through indices 0 to len-2\n2. Compare each element with the next\n3. If nums[i] == nums[i+1] → return true\n4. Return false (no adjacent duplicates)</pre>"
              }
            ],
            "solution": "func hasAdjacentDups(nums []int) bool {\n    for i := 0; i < len(nums)-1; i++ {\n        if nums[i] == nums[i+1] { return true }\n    }\n    return false\n}"
          },
          {
            "id": "v5",
            "title": "All Increasing",
            "description": "Write <code>func allIncreasing(nums []int) bool</code> - true if strictly increasing (each element < next).",
            "functionSignature": "func allIncreasing(nums []int) bool",
            "testCases": [
              {
                "input": "[]int{1, 2, 3, 4}",
                "output": "true"
              },
              {
                "input": "[]int{1, 2, 2, 3}",
                "output": "false"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "Strictly increasing means each element must be LESS than (not equal to) the next."
              },
              {
                "title": "💡 Hint",
                "content": "Compare adjacent pairs. If nums[i] >= nums[i+1], it's not strictly increasing."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Loop through indices 0 to len-2\n2. Compare each element with the next\n3. If nums[i] >= nums[i+1] → return false\n4. Return true (all strictly increasing)</pre>"
              }
            ],
            "solution": "func allIncreasing(nums []int) bool {\n    for i := 0; i < len(nums)-1; i++ {\n        if nums[i] >= nums[i+1] { return false }\n    }\n    return true\n}"
          },
          {
            "id": "v6",
            "title": "Starts And Ends Same",
            "description": "Write <code>func startsEndsSame(nums []int, k int) bool</code> - true if first k elements match last k elements.",
            "functionSignature": "func startsEndsSame(nums []int, k int) bool",
            "testCases": [
              {
                "input": "[]int{1, 2, 3, 1, 2}, 2",
                "output": "true"
              },
              {
                "input": "[]int{1, 2, 3, 4, 5}, 2",
                "output": "false"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "You need to compare the first k elements with the last k elements. What are the corresponding indices?"
              },
              {
                "title": "💡 Hint",
                "content": "Element at index i should match element at index len-k+i. Check all k pairs."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Loop i from 0 to k-1\n2. Compare nums[i] with nums[len-k+i]\n3. If mismatch → return false\n4. Return true (all pairs match)</pre>"
              }
            ],
            "solution": "func startsEndsSame(nums []int, k int) bool {\n    n := len(nums)\n    for i := 0; i < k; i++ {\n        if nums[i] != nums[n-k+i] { return false }\n    }\n    return true\n}"
          }
        ]
      },
      {
        "id": "challenge_10",
        "block": 4,
        "difficulty": 4,
        "concept": "Two-Pointer Swap",
        "docLinks": [
          {
            "url": "https://go.dev/ref/spec#Assignments",
            "title": "Go Spec: Assignments",
            "note": "simultaneous swap (a, b = b, a)"
          },
          {
            "url": "https://go.dev/blog/slices",
            "title": "Go Blog: Slices",
            "note": "in-place modifications"
          }
        ],
        "patternPrimer": {
          "bruteForce": "Create a new array and build it by iterating backwards through the original.",
          "bestApproach": "Start pointers at both ends, swap elements in place, move pointers inward until they meet.",
          "typical": "Typically O(n) time, O(1) extra space"
        },
        "variants": [
          {
            "id": "v1",
            "title": "Reverse Slice",
            "description": "Write <code>func reverse(nums []int) []int</code> that reverses in place.",
            "functionSignature": "func reverse(nums []int) []int",
            "testCases": [
              {
                "input": "[]int{1,2,3,4,5}",
                "output": "[5,4,3,2,1]"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "To reverse in-place, you swap elements from both ends working toward the middle. What pattern lets you walk two pointers toward each other?"
              },
              {
                "title": "💡 Hint",
                "content": "Use the same two-pointer loop as palindrome check, but swap the elements instead of comparing them. Stop when the pointers meet or cross."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. left pointer at start, right pointer at end\n2. While left < right:\n   - Swap elements at left and right\n   - Move both pointers inward\n3. Done (reversed in place)</pre>"
              }
            ],
            "solution": "func reverse(nums []int) []int {\n    for i, j := 0, len(nums)-1; i < j; i, j = i+1, j-1 {\n        nums[i], nums[j] = nums[j], nums[i]\n    }\n    return nums\n}"
          },
          {
            "id": "v2",
            "title": "Reverse String",
            "description": "Write <code>func reverseString(s string) string</code> that reverses a string.",
            "functionSignature": "func reverseString(s string) string",
            "testCases": [
              {
                "input": "\"hello\"",
                "output": "\"olleh\""
              },
              {
                "input": "\"Go\"",
                "output": "\"oG\""
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "To reverse in-place, you swap elements from both ends working toward the middle. What pattern lets you walk two pointers toward each other?"
              },
              {
                "title": "💡 Hint",
                "content": "Convert to []rune first (strings are immutable). Then use the same two-pointer swap as with slices."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Convert string to []rune\n2. left pointer at start, right pointer at end\n3. While left < right:\n   - Swap runes at left and right\n   - Move both pointers inward\n4. Convert back to string</pre>"
              }
            ],
            "solution": "func reverseString(s string) string {\n    r := []rune(s)\n    for i, j := 0, len(r)-1; i < j; i, j = i+1, j-1 {\n        r[i], r[j] = r[j], r[i]\n    }\n    return string(r)\n}"
          },
          {
            "id": "v3",
            "title": "Reverse Segment",
            "description": "Write <code>func reverseSegment(nums []int, start, end int)</code> that reverses elements from index start to end (inclusive).",
            "functionSignature": "func reverseSegment(nums []int, start, end int)",
            "testCases": [
              {
                "input": "[]int{1,2,3,4,5}, 1, 3",
                "output": "[1,4,3,2,5]"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "To reverse in-place, you swap elements from both ends working toward the middle. What pattern lets you walk two pointers toward each other?"
              },
              {
                "title": "💡 Hint",
                "content": "Same two-pointer pattern, but start at 'start' instead of 0, and end at 'end' instead of len-1."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. left pointer at start, right pointer at end\n2. While left < right:\n   - Swap elements at left and right\n   - Move both pointers inward\n3. Done (segment reversed in place)</pre>"
              }
            ],
            "solution": "func reverseSegment(nums []int, start, end int) {\n    for i, j := start, end; i < j; i, j = i+1, j-1 {\n        nums[i], nums[j] = nums[j], nums[i]\n    }\n}"
          },
          {
            "id": "v4",
            "title": "Swap First and Last",
            "description": "Write <code>func swapEnds(nums []int) []int</code> that swaps the first and last elements.",
            "functionSignature": "func swapEnds(nums []int) []int",
            "testCases": [
              {
                "input": "[]int{1, 2, 3, 4, 5}",
                "output": "[5, 2, 3, 4, 1]"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "You only need to swap two specific elements. What are their indices?"
              },
              {
                "title": "💡 Hint",
                "content": "First element is at index 0, last is at index len-1. Use Go's simultaneous assignment to swap."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Identify indices: first = 0, last = len-1\n2. Swap: nums[0], nums[last] = nums[last], nums[0]\n3. Return the modified slice</pre>"
              }
            ],
            "solution": "func swapEnds(nums []int) []int {\n    n := len(nums)\n    nums[0], nums[n-1] = nums[n-1], nums[0]\n    return nums\n}"
          },
          {
            "id": "v5",
            "title": "Rotate Right by One",
            "description": "Write <code>func rotateRight(nums []int) []int</code> that moves the last element to the front.",
            "functionSignature": "func rotateRight(nums []int) []int",
            "testCases": [
              {
                "input": "[]int{1, 2, 3, 4, 5}",
                "output": "[5, 1, 2, 3, 4]"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "The last element goes to index 0, and all other elements shift right by one position."
              },
              {
                "title": "💡 Hint",
                "content": "Save the last element. Then loop backwards, shifting each element to the right. Finally place the saved element at index 0."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Save last element: temp = nums[len-1]\n2. Shift all elements right: nums[i] = nums[i-1]\n3. Place saved element at front: nums[0] = temp</pre>"
              }
            ],
            "solution": "func rotateRight(nums []int) []int {\n    n := len(nums)\n    last := nums[n-1]\n    for i := n-1; i > 0; i-- {\n        nums[i] = nums[i-1]\n    }\n    nums[0] = last\n    return nums\n}"
          },
          {
            "id": "v6",
            "title": "Mirror Slice",
            "description": "Write <code>func mirror(nums []int) []int</code> that makes the second half mirror the first half. For [1,2,3,4] → [1,2,2,1].",
            "functionSignature": "func mirror(nums []int) []int",
            "testCases": [
              {
                "input": "[]int{1, 2, 3, 4}",
                "output": "[1, 2, 2, 1]"
              },
              {
                "input": "[]int{1, 2, 3, 4, 5}",
                "output": "[1, 2, 3, 2, 1]"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "You need to copy elements from the first half to matching positions in the second half."
              },
              {
                "title": "💡 Hint",
                "content": "Use two pointers: one from start, one from end. Copy nums[i] to nums[j] as long as i < j."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. left pointer at 0, right pointer at len-1\n2. While left < right:\n   - Copy nums[left] to nums[right]\n   - Move both pointers inward\n3. Return modified slice</pre>"
              }
            ],
            "solution": "func mirror(nums []int) []int {\n    for i, j := 0, len(nums)-1; i < j; i, j = i+1, j-1 {\n        nums[j] = nums[i]\n    }\n    return nums\n}"
          }
        ]
      },
      {
        "id": "challenge_11",
        "block": 4,
        "difficulty": 4,
        "concept": "Map Lookup + Early Return",
        "docLinks": [
          {
            "url": "https://go.dev/blog/maps",
            "title": "Go Blog: Go maps in action",
            "note": "map as a set pattern"
          },
          {
            "url": "https://go.dev/ref/spec#Index_expressions",
            "title": "Go Spec: Index expressions",
            "note": "checking if key exists"
          }
        ],
        "patternPrimer": {
          "bruteForce": "Nested loops: for each element, scan all previous elements to check if it appeared before.",
          "bestApproach": "Track seen elements in a map; check map in O(1) time, return immediately when found.",
          "typical": "Typically O(n) time, O(n) extra space"
        },
        "variants": [
          {
            "id": "v1",
            "title": "First Duplicate Index",
            "description": "Write <code>func firstDupIdx(nums []int) int</code> - index of first repeat, or -1.",
            "functionSignature": "func firstDupIdx(nums []int) int",
            "testCases": [
              {
                "input": "[]int{1,2,3,2}",
                "output": "3"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "You want to find the first element that appears twice. As you go through, how do you know if you've seen something before?"
              },
              {
                "title": "💡 Hint",
                "content": "Use a map as a 'seen' set. For each element, first check if it's in the map - if yes, you found a duplicate! If no, add it to the map and continue."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Create empty \"seen\" tracker\n2. For each element:\n   - Already seen? → return (found duplicate!)\n   - Not seen? → add to tracker\n3. Loop finished? → return not found</pre>"
              }
            ],
            "solution": "func firstDupIdx(nums []int) int {\n    seen := make(map[int]bool)\n    for i, n := range nums {\n        if seen[n] { return i }\n        seen[n] = true\n    }\n    return -1\n}"
          },
          {
            "id": "v2",
            "title": "First Repeat Char",
            "description": "Write <code>func firstRepeat(s string) rune</code> - first repeated char, or 0.",
            "functionSignature": "func firstRepeat(s string) rune",
            "testCases": [
              {
                "input": "\"abcab\"",
                "output": "'a'"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "You want to find the first element that appears twice. As you go through, how do you know if you've seen something before?"
              },
              {
                "title": "💡 Hint",
                "content": "Use a map as a 'seen' set. For each element, first check if it's in the map - if yes, you found a duplicate! If no, add it to the map and continue."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Create empty \"seen\" tracker\n2. For each element:\n   - Already seen? → return (found duplicate!)\n   - Not seen? → add to tracker\n3. Loop finished? → return not found</pre>"
              }
            ],
            "solution": "func firstRepeat(s string) rune {\n    seen := make(map[rune]bool)\n    for _, r := range s {\n        if seen[r] { return r }\n        seen[r] = true\n    }\n    return 0\n}"
          },
          {
            "id": "v3",
            "title": "Find Missing in Sequence",
            "description": "Write <code>func findMissing(nums []int, n int) int</code> - given numbers 1 to n with one missing, find it.",
            "functionSignature": "func findMissing(nums []int, n int) int",
            "testCases": [
              {
                "input": "[]int{1,2,4,5}, 5",
                "output": "3",
                "note": "3 is missing from 1-5"
              },
              {
                "input": "[]int{2,3,4}, 4",
                "output": "1"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "Put all the numbers you have into a set. Then check which number from 1 to n is not in the set."
              },
              {
                "title": "💡 Hint",
                "content": "First loop: add all nums to a map. Second loop: check 1 to n, return the one not in the map."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Add all nums to a 'have' map\n2. For i from 1 to n:\n   - If !have[i] → return i (found missing!)\n3. Return 0 (shouldn't happen)</pre>"
              }
            ],
            "solution": "func findMissing(nums []int, n int) int {\n    have := make(map[int]bool)\n    for _, num := range nums { have[num] = true }\n    for i := 1; i <= n; i++ {\n        if !have[i] { return i }\n    }\n    return 0\n}"
          },
          {
            "id": "v4",
            "title": "Two Sum Exists",
            "description": "Write <code>func twoSumExists(nums []int, target int) bool</code> - true if any two numbers add to target.",
            "functionSignature": "func twoSumExists(nums []int, target int) bool",
            "testCases": [
              {
                "input": "[]int{2, 7, 11, 15}, 9",
                "output": "true"
              },
              {
                "input": "[]int{2, 7, 11, 15}, 10",
                "output": "false"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "For each number, what complement would you need to see to make the target sum? How can you check if you've seen that complement?"
              },
              {
                "title": "💡 Hint",
                "content": "For each num, check if (target - num) is in your 'seen' set. If yes, you found a pair! If no, add num to seen and continue."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Create empty \"seen\" map\n2. For each num:\n   - complement = target - num\n   - seen[complement]? → return true\n   - Add num to seen\n3. Return false</pre>"
              }
            ],
            "solution": "func twoSumExists(nums []int, target int) bool {\n    seen := make(map[int]bool)\n    for _, n := range nums {\n        if seen[target-n] { return true }\n        seen[n] = true\n    }\n    return false\n}"
          },
          {
            "id": "v5",
            "title": "All Unique Words",
            "description": "Write <code>func allUnique(words []string) bool</code> - true if no word appears twice.",
            "functionSignature": "func allUnique(words []string) bool",
            "testCases": [
              {
                "input": "[]string{\"go\", \"rust\", \"python\"}",
                "output": "true"
              },
              {
                "input": "[]string{\"go\", \"rust\", \"go\"}",
                "output": "false"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "This is the inverse of 'has duplicate'. When should you return false?"
              },
              {
                "title": "💡 Hint",
                "content": "Use a map to track seen words. If you ever encounter a word you've already seen, return false. If you finish the loop, return true."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. Create empty \"seen\" map\n2. For each word:\n   - Already seen? → return false\n   - Add to seen\n3. Return true (all unique)</pre>"
              }
            ],
            "solution": "func allUnique(words []string) bool {\n    seen := make(map[string]bool)\n    for _, w := range words {\n        if seen[w] { return false }\n        seen[w] = true\n    }\n    return true\n}"
          },
          {
            "id": "v6",
            "title": "First Non-Repeating",
            "description": "Write <code>func firstNonRepeating(s string) rune</code> - first character that appears exactly once, or 0 if all repeat.",
            "functionSignature": "func firstNonRepeating(s string) rune",
            "testCases": [
              {
                "input": "\"aabbccd\"",
                "output": "'d'"
              },
              {
                "input": "\"aabbcc\"",
                "output": "0"
              }
            ],
            "hints": [
              {
                "title": "🤔 Think about it",
                "content": "You need TWO passes: first count all characters, then find the first one with count == 1."
              },
              {
                "title": "💡 Hint",
                "content": "First pass: build a frequency map. Second pass: iterate through string again and return the first char with count == 1."
              },
              {
                "title": "🔧 Pattern",
                "content": "<pre>1. First pass: count each character\n2. Second pass: for each character\n   - Count == 1? → return it\n3. Return 0 (none found)</pre>"
              }
            ],
            "solution": "func firstNonRepeating(s string) rune {\n    counts := make(map[rune]int)\n    for _, r := range s { counts[r]++ }\n    for _, r := range s {\n        if counts[r] == 1 { return r }\n    }\n    return 0\n}"
          }
        ]
      },
      {
        "id": "challenge_12",
        "block": 1,
        "difficulty": 1,
        "concept": "Simple Tallying",
        "docLinks": [
          {
            "url": "https://go.dev/blog/maps",
            "title": "Go Blog: Go maps in action",
            "note": "intro to maps"
          }
        ],
        "patternPrimer": {
          "bruteForce": "Loop through and increment a counter when condition matches.",
          "bestApproach": "Same approach - single pass counting is already optimal.",
          "typical": "Typically O(n) time, O(1) extra space"
        },
        "variants": [
          {
            "id": "v1",
            "title": "Count Specific Value",
            "description": "Write <code>func countValue(nums []int, target int) int</code> that counts how many times target appears.",
            "functionSignature": "func countValue(nums []int, target int) int",
            "testCases": [
              { "input": "[]int{1, 2, 2, 3, 2}, 2", "output": "3" },
              { "input": "[]int{5, 5, 5}, 5", "output": "3" }
            ],
            "hints": [
              { "title": "🤔 Think about it", "content": "Start with count = 0. Each time you see the target, increment count." },
              { "title": "💡 Hint", "content": "Loop through the slice. If element == target, do count++." },
              { "title": "🔧 Pattern", "content": "<pre>1. count := 0\n2. For each element:\n   - element == target? → count++\n3. Return count</pre>" }
            ],
            "solution": "func countValue(nums []int, target int) int {\n    count := 0\n    for _, n := range nums {\n        if n == target { count++ }\n    }\n    return count\n}"
          },
          {
            "id": "v2",
            "title": "Track Seen Values",
            "description": "Write <code>func trackSeen(nums []int) map[int]bool</code> that returns a map marking which values were seen.",
            "functionSignature": "func trackSeen(nums []int) map[int]bool",
            "testCases": [
              { "input": "[]int{1, 2, 2, 3}", "output": "map[1:true 2:true 3:true]" },
              { "input": "[]int{5, 5}", "output": "map[5:true]" }
            ],
            "hints": [
              { "title": "🤔 Think about it", "content": "Create a map, then mark each number as seen (true)." },
              { "title": "💡 Hint", "content": "For each number, set seen[num] = true. Maps automatically handle duplicates." },
              { "title": "🔧 Pattern", "content": "<pre>1. Create map[int]bool\n2. For each num:\n   - seen[num] = true\n3. Return map</pre>" }
            ],
            "solution": "func trackSeen(nums []int) map[int]bool {\n    seen := make(map[int]bool)\n    for _, n := range nums { seen[n] = true }\n    return seen\n}"
          },
          {
            "id": "v3",
            "title": "Count True Values",
            "description": "Write <code>func countTrue(flags []bool) int</code> that counts how many true values are in the slice.",
            "functionSignature": "func countTrue(flags []bool) int",
            "testCases": [
              { "input": "[]bool{true, false, true, true}", "output": "3" },
              { "input": "[]bool{false, false}", "output": "0" }
            ],
            "hints": [
              { "title": "🤔 Think about it", "content": "Same as counting any specific value - count when you see true." },
              { "title": "💡 Hint", "content": "if flag { count++ }" },
              { "title": "🔧 Pattern", "content": "<pre>1. count := 0\n2. For each flag:\n   - flag == true? → count++\n3. Return count</pre>" }
            ],
            "solution": "func countTrue(flags []bool) int {\n    count := 0\n    for _, f := range flags {\n        if f { count++ }\n    }\n    return count\n}"
          },
          {
            "id": "v4",
            "title": "Tally by Type",
            "description": "Write <code>func tallyTypes(words []string) map[string]int</code> that counts how many of each word type. Simple tallying intro!",
            "functionSignature": "func tallyTypes(words []string) map[string]int",
            "testCases": [
              { "input": "[]string{\"cat\", \"dog\", \"cat\", \"bird\"}", "output": "map[cat:2 dog:1 bird:1]" }
            ],
            "hints": [
              { "title": "🤔 Think about it", "content": "For each word, increment its count in the map. Maps default to 0 when accessing non-existent keys." },
              { "title": "💡 Hint", "content": "counts[word]++ works even if word isn't in the map yet (starts at 0)." },
              { "title": "🔧 Pattern", "content": "<pre>1. Create map[string]int\n2. For each word:\n   - counts[word]++\n3. Return map</pre>" }
            ],
            "solution": "func tallyTypes(words []string) map[string]int {\n    counts := make(map[string]int)\n    for _, w := range words { counts[w]++ }\n    return counts\n}"
          },
          {
            "id": "v5",
            "title": "Count Vowels and Consonants",
            "description": "Write <code>func countVowelsConsonants(s string) (int, int)</code> that returns vowel count and consonant count.",
            "functionSignature": "func countVowelsConsonants(s string) (int, int)",
            "testCases": [
              { "input": "\"hello\"", "output": "2, 3", "note": "e,o are vowels; h,l,l are consonants" },
              { "input": "\"aaa\"", "output": "3, 0" }
            ],
            "hints": [
              { "title": "🤔 Think about it", "content": "Check if each character is a vowel (a,e,i,o,u). Count separately." },
              { "title": "💡 Hint", "content": "Create a helper check: isVowel := char == 'a' || char == 'e' || ..." },
              { "title": "🔧 Pattern", "content": "<pre>1. vowels, consonants := 0, 0\n2. For each char:\n   - Is vowel? → vowels++\n   - Else → consonants++\n3. Return both</pre>" }
            ],
            "solution": "func countVowelsConsonants(s string) (int, int) {\n    vowels, consonants := 0, 0\n    for _, r := range s {\n        lower := strings.ToLower(string(r))\n        if lower == \"a\" || lower == \"e\" || lower == \"i\" || lower == \"o\" || lower == \"u\" {\n            vowels++\n        } else {\n            consonants++\n        }\n    }\n    return vowels, consonants\n}"
          },
          {
            "id": "v6",
            "title": "Has Value",
            "description": "Write <code>func hasValue(nums []int, target int) bool</code> that returns true if target is in the slice.",
            "functionSignature": "func hasValue(nums []int, target int) bool",
            "testCases": [
              { "input": "[]int{1, 2, 3}, 2", "output": "true" },
              { "input": "[]int{1, 2, 3}, 5", "output": "false" }
            ],
            "hints": [
              { "title": "🤔 Think about it", "content": "As soon as you find target, return true. If loop finishes, return false." },
              { "title": "💡 Hint", "content": "This is early return pattern - return as soon as found." },
              { "title": "🔧 Pattern", "content": "<pre>1. For each num:\n   - num == target? → return true\n2. Return false (not found)</pre>" }
            ],
            "solution": "func hasValue(nums []int, target int) bool {\n    for _, n := range nums {\n        if n == target { return true }\n    }\n    return false\n}"
          }
        ]
      },
      {
        "id": "challenge_13",
        "block": 1,
        "difficulty": 1,
        "concept": "Basic Swap Operations",
        "docLinks": [
          {
            "url": "https://go.dev/ref/spec#Assignments",
            "title": "Go Spec: Assignments",
            "note": "simultaneous assignment"
          }
        ],
        "patternPrimer": {
          "bruteForce": "Use a temp variable: temp = a, a = b, b = temp (works but verbose).",
          "bestApproach": "Go's simultaneous assignment: a, b = b, a (cleaner, evaluates right side first).",
          "typical": "Typically O(1) time, O(1) extra space"
        },
        "variants": [
          {
            "id": "v1",
            "title": "Swap Two Variables",
            "description": "Write <code>func swapVars(a, b int) (int, int)</code> that returns the values swapped.",
            "functionSignature": "func swapVars(a, b int) (int, int)",
            "testCases": [
              { "input": "3, 7", "output": "7, 3" },
              { "input": "10, 20", "output": "20, 10" }
            ],
            "hints": [
              { "title": "🤔 Think about it", "content": "Go's simultaneous assignment makes this trivial." },
              { "title": "💡 Hint", "content": "return b, a - just return them in opposite order!" },
              { "title": "🔧 Pattern", "content": "<pre>return b, a</pre>" }
            ],
            "solution": "func swapVars(a, b int) (int, int) {\n    return b, a\n}"
          },
          {
            "id": "v2",
            "title": "Swap First Two Elements",
            "description": "Write <code>func swapFirstTwo(nums []int)</code> that swaps the first two elements in place. Assume at least 2 elements.",
            "functionSignature": "func swapFirstTwo(nums []int)",
            "testCases": [
              { "input": "[]int{1, 2, 3}", "output": "[2, 1, 3]" },
              { "input": "[]int{5, 10}", "output": "[10, 5]" }
            ],
            "hints": [
              { "title": "🤔 Think about it", "content": "Use simultaneous assignment on slice indices." },
              { "title": "💡 Hint", "content": "nums[0], nums[1] = nums[1], nums[0]" },
              { "title": "🔧 Pattern", "content": "<pre>nums[0], nums[1] = nums[1], nums[0]</pre>" }
            ],
            "solution": "func swapFirstTwo(nums []int) {\n    nums[0], nums[1] = nums[1], nums[0]\n}"
          },
          {
            "id": "v3",
            "title": "Swap Ends",
            "description": "Write <code>func swapEnds(nums []int)</code> that swaps first and last elements.",
            "functionSignature": "func swapEnds(nums []int)",
            "testCases": [
              { "input": "[]int{1, 2, 3, 4}", "output": "[4, 2, 3, 1]" },
              { "input": "[]int{5, 10}", "output": "[10, 5]" }
            ],
            "hints": [
              { "title": "🤔 Think about it", "content": "Last element is at index len(nums)-1." },
              { "title": "💡 Hint", "content": "Swap nums[0] with nums[len(nums)-1]." },
              { "title": "🔧 Pattern", "content": "<pre>nums[0], nums[len(nums)-1] = nums[len(nums)-1], nums[0]</pre>" }
            ],
            "solution": "func swapEnds(nums []int) {\n    nums[0], nums[len(nums)-1] = nums[len(nums)-1], nums[0]\n}"
          },
          {
            "id": "v4",
            "title": "Swap at Indices",
            "description": "Write <code>func swapAt(nums []int, i, j int)</code> that swaps elements at positions i and j.",
            "functionSignature": "func swapAt(nums []int, i, j int)",
            "testCases": [
              { "input": "[]int{1, 2, 3, 4}, 0, 2", "output": "[3, 2, 1, 4]" },
              { "input": "[]int{5, 10, 15}, 1, 2", "output": "[5, 15, 10]" }
            ],
            "hints": [
              { "title": "🤔 Think about it", "content": "Just swap the elements at the given indices." },
              { "title": "💡 Hint", "content": "nums[i], nums[j] = nums[j], nums[i]" },
              { "title": "🔧 Pattern", "content": "<pre>nums[i], nums[j] = nums[j], nums[i]</pre>" }
            ],
            "solution": "func swapAt(nums []int, i, j int) {\n    nums[i], nums[j] = nums[j], nums[i]\n}"
          },
          {
            "id": "v5",
            "title": "Swap String Parts",
            "description": "Write <code>func swapStrings(a, b string) (string, string)</code> that swaps two strings.",
            "functionSignature": "func swapStrings(a, b string) (string, string)",
            "testCases": [
              { "input": "\"hello\", \"world\"", "output": "\"world\", \"hello\"" },
              { "input": "\"go\", \"rust\"", "output": "\"rust\", \"go\"" }
            ],
            "hints": [
              { "title": "🤔 Think about it", "content": "Same as swapping ints - just return in opposite order." },
              { "title": "💡 Hint", "content": "return b, a" },
              { "title": "🔧 Pattern", "content": "<pre>return b, a</pre>" }
            ],
            "solution": "func swapStrings(a, b string) (string, string) {\n    return b, a\n}"
          },
          {
            "id": "v6",
            "title": "Conditional Swap",
            "description": "Write <code>func swapIfGreater(a, b int) (int, int)</code> that swaps only if a > b, ensuring smaller comes first.",
            "functionSignature": "func swapIfGreater(a, b int) (int, int)",
            "testCases": [
              { "input": "5, 2", "output": "2, 5", "note": "5 > 2, so swap" },
              { "input": "3, 7", "output": "3, 7", "note": "3 < 7, no swap" }
            ],
            "hints": [
              { "title": "🤔 Think about it", "content": "Check if a > b. If so, swap. Else, leave as-is." },
              { "title": "💡 Hint", "content": "if a > b { return b, a } else { return a, b }" },
              { "title": "🔧 Pattern", "content": "<pre>if a > b {\n    return b, a\n}\nreturn a, b</pre>" }
            ],
            "solution": "func swapIfGreater(a, b int) (int, int) {\n    if a > b {\n        return b, a\n    }\n    return a, b\n}"
          }
        ]
      },
      {
        "id": "challenge_14",
        "block": 2,
        "difficulty": 2,
        "concept": "Element Comparison",
        "docLinks": [
          {
            "url": "https://go.dev/ref/spec#For_statements",
            "title": "Go Spec: For statements",
            "note": "iteration patterns"
          }
        ],
        "patternPrimer": {
          "bruteForce": "Compare adjacent elements or compare all to first element; early return on mismatch.",
          "bestApproach": "Same approach - single pass with comparisons is already optimal.",
          "typical": "Typically O(n) time, O(1) extra space"
        },
        "variants": [
          {
            "id": "v1",
            "title": "Are Equal",
            "description": "Write <code>func areEqual(nums []int) bool</code> that returns true if all elements are the same.",
            "functionSignature": "func areEqual(nums []int) bool",
            "testCases": [
              { "input": "[]int{5, 5, 5}", "output": "true" },
              { "input": "[]int{5, 5, 6}", "output": "false" }
            ],
            "hints": [
              { "title": "🤔 Think about it", "content": "If all are equal, they all equal the first element." },
              { "title": "💡 Hint", "content": "Compare each element to nums[0]. If any differs, return false." },
              { "title": "🔧 Pattern", "content": "<pre>1. For each num:\n   - num != nums[0]? → return false\n2. Return true (all equal)</pre>" }
            ],
            "solution": "func areEqual(nums []int) bool {\n    for _, n := range nums {\n        if n != nums[0] { return false }\n    }\n    return true\n}"
          },
          {
            "id": "v2",
            "title": "Has Adjacent Equal",
            "description": "Write <code>func hasAdjacentEqual(nums []int) bool</code> - true if any two adjacent elements are equal.",
            "functionSignature": "func hasAdjacentEqual(nums []int) bool",
            "testCases": [
              { "input": "[]int{1, 2, 2, 3}", "output": "true" },
              { "input": "[]int{1, 2, 3, 4}", "output": "false" }
            ],
            "hints": [
              { "title": "🤔 Think about it", "content": "Loop through, comparing each element to the next one." },
              { "title": "💡 Hint", "content": "for i := 0; i < len(nums)-1; i++ - compare nums[i] to nums[i+1]." },
              { "title": "🔧 Pattern", "content": "<pre>1. For i from 0 to len-2:\n   - nums[i] == nums[i+1]? → return true\n2. Return false</pre>" }
            ],
            "solution": "func hasAdjacentEqual(nums []int) bool {\n    for i := 0; i < len(nums)-1; i++ {\n        if nums[i] == nums[i+1] { return true }\n    }\n    return false\n}"
          },
          {
            "id": "v3",
            "title": "Is Increasing",
            "description": "Write <code>func isIncreasing(nums []int) bool</code> - true if each element is greater than the previous.",
            "functionSignature": "func isIncreasing(nums []int) bool",
            "testCases": [
              { "input": "[]int{1, 2, 3, 4}", "output": "true" },
              { "input": "[]int{1, 3, 2, 4}", "output": "false" }
            ],
            "hints": [
              { "title": "🤔 Think about it", "content": "Compare adjacent elements - each should be > previous." },
              { "title": "💡 Hint", "content": "If nums[i+1] <= nums[i], it's not strictly increasing." },
              { "title": "🔧 Pattern", "content": "<pre>1. For i from 0 to len-2:\n   - nums[i+1] <= nums[i]? → return false\n2. Return true</pre>" }
            ],
            "solution": "func isIncreasing(nums []int) bool {\n    for i := 0; i < len(nums)-1; i++ {\n        if nums[i+1] <= nums[i] { return false }\n    }\n    return true\n}"
          },
          {
            "id": "v4",
            "title": "First Greater Index",
            "description": "Write <code>func firstGreater(nums []int, threshold int) int</code> - index of first element > threshold, or -1.",
            "functionSignature": "func firstGreater(nums []int, threshold int) int",
            "testCases": [
              { "input": "[]int{1, 3, 5, 7}, 4", "output": "2", "note": "5 is first > 4" },
              { "input": "[]int{1, 2, 3}, 10", "output": "-1" }
            ],
            "hints": [
              { "title": "🤔 Think about it", "content": "Loop through with index, return index when you find one > threshold." },
              { "title": "💡 Hint", "content": "for i, n := range nums - if n > threshold return i." },
              { "title": "🔧 Pattern", "content": "<pre>1. For i, num:\n   - num > threshold? → return i\n2. Return -1</pre>" }
            ],
            "solution": "func firstGreater(nums []int, threshold int) int {\n    for i, n := range nums {\n        if n > threshold { return i }\n    }\n    return -1\n}"
          },
          {
            "id": "v5",
            "title": "Starts With Same",
            "description": "Write <code>func startsWithSame(nums []int, k int) bool</code> - true if first k elements are all equal.",
            "functionSignature": "func startsWithSame(nums []int, k int) bool",
            "testCases": [
              { "input": "[]int{5, 5, 5, 7}, 3", "output": "true" },
              { "input": "[]int{5, 5, 6, 7}, 3", "output": "false" }
            ],
            "hints": [
              { "title": "🤔 Think about it", "content": "Check if first k elements all equal nums[0]." },
              { "title": "💡 Hint", "content": "Loop i from 0 to k-1, compare nums[i] to nums[0]." },
              { "title": "🔧 Pattern", "content": "<pre>1. For i from 0 to k-1:\n   - nums[i] != nums[0]? → return false\n2. Return true</pre>" }
            ],
            "solution": "func startsWithSame(nums []int, k int) bool {\n    for i := 0; i < k; i++ {\n        if nums[i] != nums[0] { return false }\n    }\n    return true\n}"
          },
          {
            "id": "v6",
            "title": "Longest Streak of Value",
            "description": "Write <code>func longestStreak(nums []int, target int) int</code> - length of longest consecutive run of target.",
            "functionSignature": "func longestStreak(nums []int, target int) int",
            "testCases": [
              { "input": "[]int{1, 2, 2, 2, 1, 2, 2}, 2", "output": "3", "note": "three 2's in a row" },
              { "input": "[]int{1, 1, 3, 1}, 1", "output": "2" }
            ],
            "hints": [
              { "title": "🤔 Think about it", "content": "Track current streak and max streak. When you see target, increment current. When you don't, reset current." },
              { "title": "💡 Hint", "content": "Keep current and max variables. Update max whenever current > max." },
              { "title": "🔧 Pattern", "content": "<pre>1. current, max := 0, 0\n2. For each num:\n   - num == target? → current++, update max\n   - else → current = 0\n3. Return max</pre>" }
            ],
            "solution": "func longestStreak(nums []int, target int) int {\n    current, max := 0, 0\n    for _, n := range nums {\n        if n == target {\n            current++\n            if current > max { max = current }\n        } else {\n            current = 0\n        }\n    }\n    return max\n}"
          }
        ]
      }
    ],
    "advanced": [
      {
        "id": "advanced_1",
        "difficulty": 5,
        "baseTitle": "Map as Set",
        "concept": "Map as Set - Have I Seen This?",
        "variants": [
          {
            "id": "v1",
            "title": "Contains Duplicate",
            "description": "Write a function <code>func containsDuplicate(nums []int) bool</code> that returns <code>true</code> if any number appears more than once in the slice, <code>false</code> if all numbers are unique.",
            "functionSignature": "func containsDuplicate(nums []int) bool",
            "testCases": [
              {
                "input": "[]int{1, 2, 3, 1}",
                "output": "true"
              },
              {
                "input": "[]int{1, 2, 3, 4}",
                "output": "false"
              },
              {
                "input": "[]int{1, 1, 1, 1}",
                "output": "true"
              }
            ],
            "solution": "func containsDuplicate(nums []int) bool {\n    seen := make(map[int]bool)\n    for _, num := range nums {\n        if seen[num] {\n            return true\n        }\n        seen[num] = true\n    }\n    return false\n}"
          },
          {
            "id": "v2",
            "title": "First Duplicate Value",
            "description": "Write a function <code>func firstDuplicate(nums []int) int</code> that returns the first number that appears twice (the second occurrence). Return <code>-1</code> if no duplicates exist.",
            "functionSignature": "func firstDuplicate(nums []int) int",
            "testCases": [
              {
                "input": "[]int{2, 1, 3, 5, 3, 2}",
                "output": "3",
                "note": "3 is seen again before 2 is"
              },
              {
                "input": "[]int{1, 2, 3, 4}",
                "output": "-1"
              },
              {
                "input": "[]int{1, 1, 2, 2}",
                "output": "1"
              }
            ],
            "solution": "func firstDuplicate(nums []int) int {\n    seen := make(map[int]bool)\n    for _, num := range nums {\n        if seen[num] {\n            return num\n        }\n        seen[num] = true\n    }\n    return -1\n}",
            "solutionNotes": "Unlike Contains Duplicate which returns a bool, this returns the actual duplicate value. Same pattern, different return type!"
          },
          {
            "id": "v3",
            "title": "Count Unique Elements",
            "description": "Write a function <code>func countUnique(nums []int) int</code> that returns how many distinct values are in the slice.",
            "functionSignature": "func countUnique(nums []int) int",
            "testCases": [
              {
                "input": "[]int{1, 2, 2, 3, 3, 3}",
                "output": "3",
                "note": "unique values: 1, 2, 3"
              },
              {
                "input": "[]int{5, 5, 5, 5}",
                "output": "1"
              },
              {
                "input": "[]int{1, 2, 3, 4, 5}",
                "output": "5"
              }
            ],
            "solution": "func countUnique(nums []int) int {\n    seen := make(map[int]bool)\n    for _, num := range nums {\n        seen[num] = true\n    }\n    return len(seen)\n}",
            "solutionNotes": "Here we don't check if seen - we just add everything. The map handles duplicates automatically, and <code>len(seen)</code> gives us the count of unique keys!"
          },
          {
            "id": "v4",
            "title": "Find All Duplicates",
            "description": "Write a function <code>func findDuplicates(nums []int) []int</code> that returns a slice containing each number that appears more than once. Each duplicate should only appear once in the result.",
            "functionSignature": "func findDuplicates(nums []int) []int",
            "testCases": [
              {
                "input": "[]int{4, 3, 2, 7, 8, 2, 3, 1}",
                "output": "[2, 3]"
              },
              {
                "input": "[]int{1, 1, 2, 2, 3, 3}",
                "output": "[1, 2, 3]"
              },
              {
                "input": "[]int{1, 2, 3}",
                "output": "[]"
              }
            ],
            "solution": "func findDuplicates(nums []int) []int {\n    seen := make(map[int]bool)\n    added := make(map[int]bool)\n    result := []int{}\n    \n    for _, num := range nums {\n        if seen[num] && !added[num] {\n            result = append(result, num)\n            added[num] = true\n        }\n        seen[num] = true\n    }\n    return result\n}",
            "solutionNotes": "We need TWO maps here: one to track what we've seen, and one to avoid adding the same duplicate twice to the result."
          },
          {
            "id": "v5",
            "title": "Common Elements",
            "description": "Write a function <code>func hasCommon(a, b []int) bool</code> that returns <code>true</code> if the two slices share at least one common element.",
            "functionSignature": "func hasCommon(a, b []int) bool",
            "testCases": [
              {
                "input": "[]int{1, 2, 3}, []int{3, 4, 5}",
                "output": "true",
                "note": "3 is common"
              },
              {
                "input": "[]int{1, 2}, []int{3, 4}",
                "output": "false"
              },
              {
                "input": "[]int{1}, []int{1}",
                "output": "true"
              }
            ],
            "solution": "func hasCommon(a, b []int) bool {\n    setA := make(map[int]bool)\n    for _, num := range a {\n        setA[num] = true\n    }\n    \n    for _, num := range b {\n        if setA[num] {\n            return true\n        }\n    }\n    return false\n}",
            "solutionNotes": "Build a set from the first slice, then check if any element from the second slice exists in it. This is O(n+m) instead of O(n*m)!"
          },
          {
            "id": "v6",
            "title": "Find Intersection",
            "description": "Write a function <code>func intersection(a, b []int) []int</code> that returns a slice of elements that appear in both input slices. Each element should appear only once in the result.",
            "functionSignature": "func intersection(a, b []int) []int",
            "testCases": [
              {
                "input": "[]int{1, 2, 2, 1}, []int{2, 2}",
                "output": "[2]"
              },
              {
                "input": "[]int{4, 9, 5}, []int{9, 4, 9, 8, 4}",
                "output": "[9, 4]",
                "note": "or [4, 9] - order doesn't matter"
              },
              {
                "input": "[]int{1, 2}, []int{3, 4}",
                "output": "[]"
              }
            ],
            "solution": "func intersection(a, b []int) []int {\n    setA := make(map[int]bool)\n    for _, num := range a {\n        setA[num] = true\n    }\n    \n    result := []int{}\n    seen := make(map[int]bool)\n    for _, num := range b {\n        if setA[num] && !seen[num] {\n            result = append(result, num)\n            seen[num] = true\n        }\n    }\n    return result\n}",
            "solutionNotes": "Similar to hasCommon, but we collect the common elements instead of just returning true. We use a second map to avoid adding duplicates to the result."
          }
        ]
      },
      {
        "id": "advanced_2",
        "difficulty": 5,
        "baseTitle": "Two-Pointer In-Place",
        "concept": "Slow/Fast Pointer Pattern",
        "variants": [
          {
            "id": "v1",
            "title": "Remove Duplicates from Sorted Array",
            "description": "Write a function <code>func removeDuplicates(nums []int) int</code> that removes duplicates from a sorted slice <strong>in-place</strong>. Return the number of unique elements. The first k elements should contain the unique values.",
            "functionSignature": "func removeDuplicates(nums []int) int",
            "testCases": [
              {
                "input": "[]int{1, 1, 2}",
                "output": "2",
                "note": "array becomes [1, 2, _]"
              },
              {
                "input": "[]int{0, 0, 1, 1, 2, 2, 3}",
                "output": "4",
                "note": "array becomes [0, 1, 2, 3, _, _, _]"
              },
              {
                "input": "[]int{1, 2, 3}",
                "output": "3"
              }
            ],
            "solution": "func removeDuplicates(nums []int) int {\n    if len(nums) == 0 {\n        return 0\n    }\n    slow := 0\n    for fast := 1; fast < len(nums); fast++ {\n        if nums[fast] != nums[slow] {\n            slow++\n            nums[slow] = nums[fast]\n        }\n    }\n    return slow + 1\n}"
          },
          {
            "id": "v2",
            "title": "Remove Element",
            "description": "Write a function <code>func removeElement(nums []int, val int) int</code> that removes all occurrences of <code>val</code> <strong>in-place</strong>. Return the number of elements remaining. Order doesn't need to be preserved.",
            "functionSignature": "func removeElement(nums []int, val int) int",
            "testCases": [
              {
                "input": "[]int{3, 2, 2, 3}, 3",
                "output": "2",
                "note": "array becomes [2, 2, _, _]"
              },
              {
                "input": "[]int{0, 1, 2, 2, 3, 0, 4, 2}, 2",
                "output": "5"
              },
              {
                "input": "[]int{1}, 1",
                "output": "0"
              }
            ],
            "solution": "func removeElement(nums []int, val int) int {\n    slow := 0\n    for fast := 0; fast < len(nums); fast++ {\n        if nums[fast] != val {\n            nums[slow] = nums[fast]\n            slow++\n        }\n    }\n    return slow\n}",
            "solutionNotes": "Unlike Remove Duplicates, here we compare against a fixed value, not the previous element. And both pointers start at 0."
          },
          {
            "id": "v3",
            "title": "Move Zeroes",
            "description": "Write a function <code>func moveZeroes(nums []int)</code> that moves all <code>0</code>s to the end of the slice while maintaining the relative order of non-zero elements. Modify in-place.",
            "functionSignature": "func moveZeroes(nums []int)",
            "testCases": [
              {
                "input": "[]int{0, 1, 0, 3, 12}",
                "output": "[1, 3, 12, 0, 0]"
              },
              {
                "input": "[]int{0, 0, 1}",
                "output": "[1, 0, 0]"
              },
              {
                "input": "[]int{1, 2, 3}",
                "output": "[1, 2, 3]",
                "note": "no zeroes"
              }
            ],
            "solution": "func moveZeroes(nums []int) {\n    slow := 0\n    \n    for fast := 0; fast < len(nums); fast++ {\n        if nums[fast] != 0 {\n            nums[slow] = nums[fast]\n            slow++\n        }\n    }\n    \n    for i := slow; i < len(nums); i++ {\n        nums[i] = 0\n    }\n}",
            "solutionNotes": "This is a two-pass solution. First pass moves non-zeroes forward, second pass fills remaining positions with zeroes. Can also be done in one pass with swapping!"
          },
          {
            "id": "v4",
            "title": "Remove Duplicates II (Allow 2)",
            "description": "Write a function <code>func removeDuplicatesII(nums []int) int</code> that removes duplicates from a sorted array such that each element appears <strong>at most twice</strong>. Return the new length.",
            "functionSignature": "func removeDuplicatesII(nums []int) int",
            "testCases": [
              {
                "input": "[]int{1, 1, 1, 2, 2, 3}",
                "output": "5",
                "note": "becomes [1, 1, 2, 2, 3, _]"
              },
              {
                "input": "[]int{0, 0, 1, 1, 1, 1, 2, 3, 3}",
                "output": "7"
              },
              {
                "input": "[]int{1, 1}",
                "output": "2"
              }
            ],
            "solution": "func removeDuplicatesII(nums []int) int {\n    if len(nums) <= 2 {\n        return len(nums)\n    }\n    \n    slow := 2\n    for fast := 2; fast < len(nums); fast++ {\n        if nums[fast] != nums[slow-2] {\n            nums[slow] = nums[fast]\n            slow++\n        }\n    }\n    return slow\n}",
            "solutionNotes": "The key insight: compare with nums[slow-2], not nums[slow-1]. This ensures at most 2 of each value. Start both pointers at index 2."
          },
          {
            "id": "v5",
            "title": "Sorted Squares",
            "description": "Write a function <code>func sortedSquares(nums []int) []int</code> that returns an array of the squares of each number, sorted in ascending order. Input is sorted but may contain negatives.",
            "functionSignature": "func sortedSquares(nums []int) []int",
            "testCases": [
              {
                "input": "[]int{-4, -1, 0, 3, 10}",
                "output": "[0, 1, 9, 16, 100]"
              },
              {
                "input": "[]int{-7, -3, 2, 3, 11}",
                "output": "[4, 9, 9, 49, 121]"
              },
              {
                "input": "[]int{1, 2, 3}",
                "output": "[1, 4, 9]"
              }
            ],
            "solution": "func sortedSquares(nums []int) []int {\n    n := len(nums)\n    result := make([]int, n)\n    left, right := 0, n-1\n    pos := n - 1\n    \n    for left <= right {\n        leftSq := nums[left] * nums[left]\n        rightSq := nums[right] * nums[right]\n        \n        if leftSq > rightSq {\n            result[pos] = leftSq\n            left++\n        } else {\n            result[pos] = rightSq\n            right--\n        }\n        pos--\n    }\n    return result\n}",
            "solutionNotes": "This uses two pointers from OPPOSITE ENDS (not slow/fast). The largest squares are at the edges (most negative or most positive). Fill result array from the back."
          },
          {
            "id": "v6",
            "title": "Merge Sorted Array",
            "description": "Write a function <code>func merge(nums1 []int, m int, nums2 []int, n int)</code> that merges nums2 into nums1 <strong>in-place</strong>. nums1 has length m+n, with the last n elements being 0 (placeholders).",
            "functionSignature": "func merge(nums1 []int, m int, nums2 []int, n int)",
            "testCases": [
              {
                "input": "[]int{1, 2, 3, 0, 0, 0}, 3, []int{2, 5, 6}, 3",
                "output": "[1, 2, 2, 3, 5, 6]"
              },
              {
                "input": "[]int{1}, 1, []int{}, 0",
                "output": "[1]"
              },
              {
                "input": "[]int{0}, 0, []int{1}, 1",
                "output": "[1]"
              }
            ],
            "solution": "func merge(nums1 []int, m int, nums2 []int, n int) {\n    p1 := m - 1\n    p2 := n - 1\n    pos := m + n - 1\n    \n    for p2 >= 0 {\n        if p1 >= 0 && nums1[p1] > nums2[p2] {\n            nums1[pos] = nums1[p1]\n            p1--\n        } else {\n            nums1[pos] = nums2[p2]\n            p2--\n        }\n        pos--\n    }\n}",
            "solutionNotes": "Work BACKWARDS to avoid overwriting elements we haven't processed. The loop continues until all of nums2 is merged. If nums1 elements remain, they're already in place."
          }
        ]
      },
      {
        "id": "advanced_3",
        "difficulty": 5,
        "baseTitle": "String Manipulation",
        "concept": "Runes + Two-Pointer Swap",
        "variants": [
          {
            "id": "v1",
            "title": "Reverse a String",
            "description": "Write <code>func reverse(s string) string</code> that reverses any string, including Unicode characters like emojis.",
            "functionSignature": "func reverse(s string) string",
            "testCases": [
              {
                "input": "\"hello\"",
                "output": "\"olleh\""
              },
              {
                "input": "\"世界\"",
                "output": "\"界世\""
              },
              {
                "input": "\"Go🚀\"",
                "output": "\"🚀oG\""
              }
            ],
            "solution": "func reverse(s string) string {\n    runes := []rune(s)\n    for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {\n        runes[i], runes[j] = runes[j], runes[i]\n    }\n    return string(runes)\n}"
          },
          {
            "id": "v2",
            "title": "Is Palindrome",
            "description": "Write <code>func isPalindrome(s string) bool</code> that checks if a string reads the same forwards and backwards. Consider only alphanumeric characters and ignore case.",
            "functionSignature": "func isPalindrome(s string) bool",
            "testCases": [
              {
                "input": "\"A man, a plan, a canal: Panama\"",
                "output": "true"
              },
              {
                "input": "\"race a car\"",
                "output": "false"
              },
              {
                "input": "\"Was it a car or a cat I saw?\"",
                "output": "true"
              }
            ],
            "solution": "import \"unicode\"\n\nfunc isPalindrome(s string) bool {\n    runes := []rune{}\n    for _, r := range s {\n        if unicode.IsLetter(r) || unicode.IsDigit(r) {\n            runes = append(runes, unicode.ToLower(r))\n        }\n    }\n    \n    for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {\n        if runes[i] != runes[j] {\n            return false\n        }\n    }\n    return true\n}",
            "solutionNotes": "First filter to only alphanumeric and lowercase, then use two-pointer comparison. The <code>unicode</code> package helps with character classification."
          },
          {
            "id": "v3",
            "title": "Reverse Words in String",
            "description": "Write <code>func reverseWords(s string) string</code> that reverses the order of words (not characters). Words are separated by spaces.",
            "functionSignature": "func reverseWords(s string) string",
            "testCases": [
              {
                "input": "\"hello world\"",
                "output": "\"world hello\""
              },
              {
                "input": "\"the sky is blue\"",
                "output": "\"blue is sky the\""
              },
              {
                "input": "\"Go\"",
                "output": "\"Go\""
              }
            ],
            "solution": "import \"strings\"\n\nfunc reverseWords(s string) string {\n    words := strings.Fields(s)\n    \n    for i, j := 0, len(words)-1; i < j; i, j = i+1, j-1 {\n        words[i], words[j] = words[j], words[i]\n    }\n    \n    return strings.Join(words, \" \")\n}",
            "solutionNotes": "Use <code>strings.Fields</code> to split by whitespace, reverse the slice of words, then <code>strings.Join</code> back together."
          },
          {
            "id": "v4",
            "title": "Reverse Only Letters",
            "description": "Write <code>func reverseOnlyLetters(s string) string</code> that reverses only the letters in a string. All other characters stay in their original positions.",
            "functionSignature": "func reverseOnlyLetters(s string) string",
            "testCases": [
              {
                "input": "\"a-bC-dEf-ghIj\"",
                "output": "\"j-Ih-gfE-dCba\""
              },
              {
                "input": "\"ab-cd\"",
                "output": "\"dc-ba\""
              },
              {
                "input": "\"Test1ng-Leet=code-Q!\"",
                "output": "\"Qedo1teleC-test=gnin-T!\"",
                "note": "wait that's wrong"
              }
            ],
            "solution": "import \"unicode\"\n\nfunc reverseOnlyLetters(s string) string {\n    runes := []rune(s)\n    i, j := 0, len(runes)-1\n    \n    for i < j {\n        for i < j && !unicode.IsLetter(runes[i]) {\n            i++\n        }\n        for i < j && !unicode.IsLetter(runes[j]) {\n            j--\n        }\n        if i < j {\n            runes[i], runes[j] = runes[j], runes[i]\n            i++\n            j--\n        }\n    }\n    return string(runes)\n}",
            "solutionNotes": "Two pointers that skip non-letters. Only swap when both pointers are on letters. This is a variation of the standard reverse with added skip logic."
          },
          {
            "id": "v5",
            "title": "Valid Palindrome II",
            "description": "Write <code>func validPalindromeII(s string) bool</code> that returns true if the string can become a palindrome by removing <strong>at most one</strong> character.",
            "functionSignature": "func validPalindromeII(s string) bool",
            "testCases": [
              {
                "input": "\"aba\"",
                "output": "true",
                "note": "already palindrome"
              },
              {
                "input": "\"abca\"",
                "output": "true",
                "note": "remove 'c' or 'b'"
              },
              {
                "input": "\"abc\"",
                "output": "false"
              }
            ],
            "solution": "func validPalindromeII(s string) bool {\n    runes := []rune(s)\n    \n    isPalin := func(i, j int) bool {\n        for i < j {\n            if runes[i] != runes[j] {\n                return false\n            }\n            i++\n            j--\n        }\n        return true\n    }\n    \n    i, j := 0, len(runes)-1\n    for i < j {\n        if runes[i] != runes[j] {\n            return isPalin(i+1, j) || isPalin(i, j-1)\n        }\n        i++\n        j--\n    }\n    return true\n}",
            "solutionNotes": "When we find a mismatch, we have one chance: try skipping the left char OR the right char. If either results in a palindrome, return true."
          },
          {
            "id": "v6",
            "title": "Rotate String Left",
            "description": "Write <code>func rotateLeft(s string, k int) string</code> that rotates a string left by k positions. Characters that fall off the left reappear on the right.",
            "functionSignature": "func rotateLeft(s string, k int) string",
            "testCases": [
              {
                "input": "\"abcdef\", 2",
                "output": "\"cdefab\""
              },
              {
                "input": "\"hello\", 1",
                "output": "\"elloh\""
              },
              {
                "input": "\"Go\", 4",
                "output": "\"Go\"",
                "note": "k=4 is same as k=0 for len=2"
              }
            ],
            "solution": "func rotateLeft(s string, k int) string {\n    if len(s) == 0 {\n        return s\n    }\n    runes := []rune(s)\n    k = k % len(runes)\n    \n    reverse := func(start, end int) {\n        for start < end {\n            runes[start], runes[end] = runes[end], runes[start]\n            start++\n            end--\n        }\n    }\n    \n    reverse(0, k-1)\n    reverse(k, len(runes)-1)\n    reverse(0, len(runes)-1)\n    \n    return string(runes)\n}",
            "solutionNotes": "The \"reversal algorithm\" for rotation: reverse the first k elements, reverse the rest, then reverse the entire array. Three reversals achieve a rotation!"
          }
        ]
      },
      {
        "id": "advanced_4",
        "difficulty": 5,
        "baseTitle": "Map Counting",
        "concept": "Map Counting Pattern",
        "variants": [
          {
            "id": "v1",
            "title": "Word Counter",
            "description": "Write <code>func wordCount(s string) map[string]int</code> that counts how many times each word appears in a string.",
            "functionSignature": "func wordCount(s string) map[string]int",
            "testCases": [
              {
                "input": "\"the quick brown fox jumps over the lazy dog\"",
                "output": "map[brown:1 dog:1 fox:1 jumps:1 lazy:1 over:1 quick:1 the:2]"
              }
            ],
            "solution": "import \"strings\"\n\nfunc wordCount(s string) map[string]int {\n    counts := make(map[string]int)\n    for _, word := range strings.Fields(s) {\n        counts[word]++\n    }\n    return counts\n}"
          },
          {
            "id": "v2",
            "title": "Most Frequent Element",
            "description": "Write <code>func mostFrequent(nums []int) int</code> that returns the element that appears most frequently. If there's a tie, return any of them.",
            "functionSignature": "func mostFrequent(nums []int) int",
            "testCases": [
              {
                "input": "[]int{1, 3, 2, 1, 4, 1}",
                "output": "1",
                "note": "1 appears 3 times"
              },
              {
                "input": "[]int{5, 5, 4, 4, 4}",
                "output": "4"
              },
              {
                "input": "[]int{7}",
                "output": "7"
              }
            ],
            "solution": "func mostFrequent(nums []int) int {\n    counts := make(map[int]int)\n    for _, num := range nums {\n        counts[num]++\n    }\n    \n    maxCount := 0\n    result := nums[0]\n    for num, count := range counts {\n        if count > maxCount {\n            maxCount = count\n            result = num\n        }\n    }\n    return result\n}",
            "solutionNotes": "First count everything, then iterate the map to find the max. This is a two-pass approach over different data structures."
          },
          {
            "id": "v3",
            "title": "First Unique Character",
            "description": "Write <code>func firstUniqChar(s string) int</code> that returns the index of the first non-repeating character. Return -1 if none exists.",
            "functionSignature": "func firstUniqChar(s string) int",
            "testCases": [
              {
                "input": "\"leetcode\"",
                "output": "0",
                "note": "'l' is first unique"
              },
              {
                "input": "\"loveleetcode\"",
                "output": "2",
                "note": "'v' is first unique"
              },
              {
                "input": "\"aabb\"",
                "output": "-1"
              }
            ],
            "solution": "func firstUniqChar(s string) int {\n    counts := make(map[rune]int)\n    runes := []rune(s)\n    \n    for _, r := range runes {\n        counts[r]++\n    }\n    \n    for i, r := range runes {\n        if counts[r] == 1 {\n            return i\n        }\n    }\n    return -1\n}",
            "solutionNotes": "Two passes needed: first to count, second to find the first character with count == 1. We iterate the original string (not the map) to preserve order."
          },
          {
            "id": "v4",
            "title": "Is Anagram",
            "description": "Write <code>func isAnagram(s, t string) bool</code> that returns true if t is an anagram of s (same letters, different order).",
            "functionSignature": "func isAnagram(s, t string) bool",
            "testCases": [
              {
                "input": "\"anagram\", \"nagaram\"",
                "output": "true"
              },
              {
                "input": "\"rat\", \"car\"",
                "output": "false"
              },
              {
                "input": "\"listen\", \"silent\"",
                "output": "true"
              }
            ],
            "solution": "func isAnagram(s, t string) bool {\n    if len(s) != len(t) {\n        return false\n    }\n    \n    counts := make(map[rune]int)\n    for _, r := range s {\n        counts[r]++\n    }\n    for _, r := range t {\n        counts[r]--\n        if counts[r] < 0 {\n            return false\n        }\n    }\n    return true\n}",
            "solutionNotes": "Count characters in s (increment), then 'uncount' characters in t (decrement). If we ever go negative, t has a character s doesn't have."
          },
          {
            "id": "v5",
            "title": "Can Construct",
            "description": "Write <code>func canConstruct(ransomNote, magazine string) bool</code> that returns true if ransomNote can be constructed from magazine letters (each letter used once).",
            "functionSignature": "func canConstruct(ransomNote, magazine string) bool",
            "testCases": [
              {
                "input": "\"a\", \"b\"",
                "output": "false"
              },
              {
                "input": "\"aa\", \"aab\"",
                "output": "true"
              },
              {
                "input": "\"aa\", \"ab\"",
                "output": "false",
                "note": "need 2 a's but only 1"
              }
            ],
            "solution": "func canConstruct(ransomNote, magazine string) bool {\n    available := make(map[rune]int)\n    \n    for _, r := range magazine {\n        available[r]++\n    }\n    \n    for _, r := range ransomNote {\n        available[r]--\n        if available[r] < 0 {\n            return false\n        }\n    }\n    return true\n}",
            "solutionNotes": "Similar to anagram check, but one-directional: we only need to verify ransomNote letters exist in magazine, not vice versa."
          },
          {
            "id": "v6",
            "title": "Majority Element",
            "description": "Write <code>func majorityElement(nums []int) int</code> that finds the element appearing more than n/2 times. Assume such element always exists.",
            "functionSignature": "func majorityElement(nums []int) int",
            "testCases": [
              {
                "input": "[]int{3, 2, 3}",
                "output": "3"
              },
              {
                "input": "[]int{2, 2, 1, 1, 1, 2, 2}",
                "output": "2"
              },
              {
                "input": "[]int{1, 1, 1, 1}",
                "output": "1"
              }
            ],
            "solution": "func majorityElement(nums []int) int {\n    counts := make(map[int]int)\n    threshold := len(nums) / 2\n    \n    for _, num := range nums {\n        counts[num]++\n        if counts[num] > threshold {\n            return num\n        }\n    }\n    return -1\n}",
            "solutionNotes": "We can return early as soon as any element exceeds n/2 count. No need to finish counting everything!"
          }
        ]
      },
      {
        "id": "advanced_5",
        "difficulty": 5,
        "baseTitle": "Hash Map Lookup",
        "concept": "Hash Map Complement Pattern",
        "variants": [
          {
            "id": "v1",
            "title": "Two Sum",
            "description": "Given a slice of ints and a target, return indices of two numbers that add up to the target. <code>func twoSum(nums []int, target int) []int</code>",
            "functionSignature": "func twoSum(nums []int, target int) []int",
            "testCases": [
              {
                "input": "[]int{2, 7, 11, 15}, 9",
                "output": "[0, 1]"
              },
              {
                "input": "[]int{3, 2, 4}, 6",
                "output": "[1, 2]"
              },
              {
                "input": "[]int{3, 3}, 6",
                "output": "[0, 1]"
              }
            ],
            "solution": "func twoSum(nums []int, target int) []int {\n    seen := make(map[int]int)\n    for i, num := range nums {\n        complement := target - num\n        if j, ok := seen[complement]; ok {\n            return []int{j, i}\n        }\n        seen[num] = i\n    }\n    return nil\n}"
          },
          {
            "id": "v2",
            "title": "Two Sum II (Sorted Input)",
            "description": "Given a <strong>sorted</strong> array and target, return indices (1-indexed) of two numbers that add to target. Use two pointers instead of a hash map. <code>func twoSumSorted(nums []int, target int) []int</code>",
            "functionSignature": "func twoSumSorted(nums []int, target int) []int",
            "testCases": [
              {
                "input": "[]int{2, 7, 11, 15}, 9",
                "output": "[1, 2]",
                "note": "1-indexed!"
              },
              {
                "input": "[]int{2, 3, 4}, 6",
                "output": "[1, 3]"
              },
              {
                "input": "[]int{-1, 0}, -1",
                "output": "[1, 2]"
              }
            ],
            "solution": "func twoSumSorted(nums []int, target int) []int {\n    left, right := 0, len(nums)-1\n    \n    for left < right {\n        sum := nums[left] + nums[right]\n        if sum == target {\n            return []int{left + 1, right + 1}\n        } else if sum < target {\n            left++\n        } else {\n            right--\n        }\n    }\n    return nil\n}",
            "solutionNotes": "When input is sorted, two pointers is O(1) space vs O(n) for hash map. Move left pointer right for larger sum, right pointer left for smaller sum."
          },
          {
            "id": "v3",
            "title": "Pair with Difference",
            "description": "Find two numbers whose <strong>difference</strong> equals the target. Return their indices (smaller index first). <code>func pairWithDiff(nums []int, target int) []int</code>",
            "functionSignature": "func pairWithDiff(nums []int, target int) []int",
            "testCases": [
              {
                "input": "[]int{5, 20, 3, 2, 50, 80}, 78",
                "output": "[1, 5]",
                "note": "80 - 2 = 78... wait"
              },
              {
                "input": "[]int{1, 5, 3}, 2",
                "output": "[0, 2]",
                "note": "3 - 1 = 2"
              },
              {
                "input": "[]int{1, 2, 3}, 10",
                "output": "nil"
              }
            ],
            "solution": "func pairWithDiff(nums []int, target int) []int {\n    seen := make(map[int]int)\n    \n    for i, num := range nums {\n        if j, ok := seen[num-target]; ok {\n            return []int{j, i}\n        }\n        if j, ok := seen[num+target]; ok {\n            return []int{j, i}\n        }\n        seen[num] = i\n    }\n    return nil\n}",
            "solutionNotes": "Unlike Two Sum where we look for target-num, here we look for BOTH num-target AND num+target because either could be the pair (a-b=k or b-a=k)."
          },
          {
            "id": "v4",
            "title": "Count Pairs with Sum",
            "description": "Count how many pairs of numbers add up to exactly the target. Each element can only be used once. <code>func countPairs(nums []int, target int) int</code>",
            "functionSignature": "func countPairs(nums []int, target int) int",
            "testCases": [
              {
                "input": "[]int{1, 5, 7, 1}, 6",
                "output": "2",
                "note": "(1,5) and (1,5)"
              },
              {
                "input": "[]int{1, 1, 1, 1}, 2",
                "output": "2",
                "note": "two pairs of 1+1"
              },
              {
                "input": "[]int{1, 2, 3}, 10",
                "output": "0"
              }
            ],
            "solution": "func countPairs(nums []int, target int) int {\n    counts := make(map[int]int)\n    for _, num := range nums {\n        counts[num]++\n    }\n    \n    pairs := 0\n    for num, count := range counts {\n        complement := target - num\n        if complement == num {\n            pairs += count * (count - 1) / 2\n        } else if compCount, ok := counts[complement]; ok && complement > num {\n            pairs += count * compCount\n        }\n    }\n    return pairs\n}",
            "solutionNotes": "This is trickier! We count occurrences first, then for each unique number, find pairs. Handle same-number pairs specially (n choose 2). Use complement > num to avoid double counting."
          },
          {
            "id": "v5",
            "title": "Three Sum Exists",
            "description": "Return <code>true</code> if any three numbers in the array sum to zero. <code>func threeSumExists(nums []int) bool</code>",
            "functionSignature": "func threeSumExists(nums []int) bool",
            "testCases": [
              {
                "input": "[]int{-1, 0, 1, 2}",
                "output": "true",
                "note": "-1 + 0 + 1 = 0"
              },
              {
                "input": "[]int{1, 2, 3}",
                "output": "false"
              },
              {
                "input": "[]int{0, 0, 0}",
                "output": "true"
              }
            ],
            "solution": "import \"sort\"\n\nfunc threeSumExists(nums []int) bool {\n    sort.Ints(nums)\n    n := len(nums)\n    \n    for i := 0; i < n-2; i++ {\n        if i > 0 && nums[i] == nums[i-1] {\n            continue\n        }\n        \n        left, right := i+1, n-1\n        target := -nums[i]\n        \n        for left < right {\n            sum := nums[left] + nums[right]\n            if sum == target {\n                return true\n            } else if sum < target {\n                left++\n            } else {\n                right--\n            }\n        }\n    }\n    return false\n}",
            "solutionNotes": "Fix one number, then use Two Sum II (sorted) for the other two. Sorting first enables the two-pointer approach. O(n²) total."
          },
          {
            "id": "v6",
            "title": "Subarray Sum Equals K",
            "description": "Count the number of continuous subarrays whose elements sum to k. <code>func subarraySum(nums []int, k int) int</code>",
            "functionSignature": "func subarraySum(nums []int, k int) int",
            "testCases": [
              {
                "input": "[]int{1, 1, 1}, 2",
                "output": "2",
                "note": "[1,1] at positions 0-1 and 1-2"
              },
              {
                "input": "[]int{1, 2, 3}, 3",
                "output": "2",
                "note": "[1,2] and [3]"
              },
              {
                "input": "[]int{1, -1, 0}, 0",
                "output": "3"
              }
            ],
            "solution": "func subarraySum(nums []int, k int) int {\n    count := 0\n    prefixSum := 0\n    seen := make(map[int]int)\n    seen[0] = 1\n    \n    for _, num := range nums {\n        prefixSum += num\n        if c, ok := seen[prefixSum-k]; ok {\n            count += c\n        }\n        seen[prefixSum]++\n    }\n    return count\n}",
            "solutionNotes": "This uses the prefix sum technique with a hash map. If prefix[j] - prefix[i] = k, then subarray [i+1...j] sums to k. We track how many times each prefix sum has occurred."
          }
        ]
      },
      {
        "id": "advanced_6",
        "difficulty": 5,
        "baseTitle": "Sliding Window",
        "concept": "Sliding Window Pattern",
        "variants": [
          {
            "id": "v1",
            "title": "Maximum Sum Subarray of Size K",
            "description": "Given an array of integers and a number k, find the maximum sum of any contiguous subarray of size k. <code>func maxSumSubarray(nums []int, k int) int</code>",
            "functionSignature": "func maxSumSubarray(nums []int, k int) int",
            "testCases": [
              {
                "input": "[]int{2, 1, 5, 1, 3, 2}, 3",
                "output": "9",
                "note": "subarray [5,1,3]"
              },
              {
                "input": "[]int{2, 3, 4, 1, 5}, 2",
                "output": "7",
                "note": "subarray [3,4]"
              },
              {
                "input": "[]int{1, 1, 1, 1}, 2",
                "output": "2"
              }
            ],
            "solution": "func maxSumSubarray(nums []int, k int) int {\n    if len(nums) < k {\n        return 0\n    }\n    windowSum := 0\n    for i := 0; i < k; i++ {\n        windowSum += nums[i]\n    }\n    maxSum := windowSum\n    \n    for i := k; i < len(nums); i++ {\n        windowSum += nums[i] - nums[i-k]\n        if windowSum > maxSum {\n            maxSum = windowSum\n        }\n    }\n    return maxSum\n}",
            "solutionNotes": "Fixed-size window: calculate first window sum, then slide by adding new element and subtracting leaving element. O(n) time, O(1) space."
          },
          {
            "id": "v2",
            "title": "Longest Substring Without Repeating",
            "description": "Find the length of the longest substring without repeating characters. <code>func lengthOfLongestSubstring(s string) int</code>",
            "functionSignature": "func lengthOfLongestSubstring(s string) int",
            "testCases": [
              {
                "input": "\"abcabcbb\"",
                "output": "3",
                "note": "\"abc\""
              },
              {
                "input": "\"bbbbb\"",
                "output": "1",
                "note": "\"b\""
              },
              {
                "input": "\"pwwkew\"",
                "output": "3",
                "note": "\"wke\""
              }
            ],
            "solution": "func lengthOfLongestSubstring(s string) int {\n    seen := make(map[byte]int)\n    maxLen := 0\n    left := 0\n    \n    for right := 0; right < len(s); right++ {\n        char := s[right]\n        if lastIdx, ok := seen[char]; ok && lastIdx >= left {\n            left = lastIdx + 1\n        }\n        seen[char] = right\n        if right - left + 1 > maxLen {\n            maxLen = right - left + 1\n        }\n    }\n    return maxLen\n}",
            "solutionNotes": "Variable-size window: expand right, shrink left when duplicate found. Track last seen index of each character to know where to shrink to."
          },
          {
            "id": "v3",
            "title": "Minimum Size Subarray Sum",
            "description": "Find the minimal length of a contiguous subarray whose sum is >= target. Return 0 if no such subarray. <code>func minSubarrayLen(target int, nums []int) int</code>",
            "functionSignature": "func minSubarrayLen(target int, nums []int) int",
            "testCases": [
              {
                "input": "7, []int{2, 3, 1, 2, 4, 3}",
                "output": "2",
                "note": "[4,3] sums to 7"
              },
              {
                "input": "4, []int{1, 4, 4}",
                "output": "1",
                "note": "[4] alone >= 4"
              },
              {
                "input": "11, []int{1, 1, 1, 1}",
                "output": "0",
                "note": "can't reach 11"
              }
            ],
            "solution": "func minSubarrayLen(target int, nums []int) int {\n    minLen := len(nums) + 1\n    left := 0\n    sum := 0\n    \n    for right := 0; right < len(nums); right++ {\n        sum += nums[right]\n        \n        for sum >= target {\n            if right - left + 1 < minLen {\n                minLen = right - left + 1\n            }\n            sum -= nums[left]\n            left++\n        }\n    }\n    \n    if minLen == len(nums) + 1 {\n        return 0\n    }\n    return minLen\n}",
            "solutionNotes": "Variable-size window with condition: expand to increase sum, shrink while condition met to find minimum. Classic 'minimum window' pattern."
          },
          {
            "id": "v4",
            "title": "Average of Subarrays of Size K",
            "description": "Given an array, find the average of all contiguous subarrays of size k. <code>func averageOfSubarrays(nums []int, k int) []float64</code>",
            "functionSignature": "func averageOfSubarrays(nums []int, k int) []float64",
            "testCases": [
              {
                "input": "[]int{1, 3, 2, 6, -1, 4, 1, 8, 2}, 5",
                "output": "[2.2, 2.8, 2.4, 3.6, 2.8]"
              },
              {
                "input": "[]int{1, 2, 3, 4}, 2",
                "output": "[1.5, 2.5, 3.5]"
              }
            ],
            "solution": "func averageOfSubarrays(nums []int, k int) []float64 {\n    result := []float64{}\n    windowSum := 0\n    \n    for i := 0; i < len(nums); i++ {\n        windowSum += nums[i]\n        \n        if i >= k-1 {\n            result = append(result, float64(windowSum)/float64(k))\n            windowSum -= nums[i-k+1]\n        }\n    }\n    return result\n}",
            "solutionNotes": "Basic fixed-window pattern. Build up sum for first k elements, then slide and track averages."
          },
          {
            "id": "v5",
            "title": "Contains Duplicate Within K Distance",
            "description": "Return true if there are two distinct indices i and j where nums[i] == nums[j] and abs(i - j) <= k. <code>func containsNearbyDuplicate(nums []int, k int) bool</code>",
            "functionSignature": "func containsNearbyDuplicate(nums []int, k int) bool",
            "testCases": [
              {
                "input": "[]int{1, 2, 3, 1}, 3",
                "output": "true"
              },
              {
                "input": "[]int{1, 0, 1, 1}, 1",
                "output": "true"
              },
              {
                "input": "[]int{1, 2, 3, 1, 2, 3}, 2",
                "output": "false"
              }
            ],
            "solution": "func containsNearbyDuplicate(nums []int, k int) bool {\n    seen := make(map[int]bool)\n    \n    for i, num := range nums {\n        if seen[num] {\n            return true\n        }\n        seen[num] = true\n        \n        if i >= k {\n            delete(seen, nums[i-k])\n        }\n    }\n    return false\n}",
            "solutionNotes": "Maintain a sliding window of size k as a set. If we see a duplicate within the window, return true. Remove elements that leave the window."
          },
          {
            "id": "v6",
            "title": "Max Consecutive Ones III",
            "description": "Given a binary array and integer k, return the maximum number of consecutive 1's if you can flip at most k 0's. <code>func longestOnes(nums []int, k int) int</code>",
            "functionSignature": "func longestOnes(nums []int, k int) int",
            "testCases": [
              {
                "input": "[]int{1,1,1,0,0,0,1,1,1,1,0}, 2",
                "output": "6",
                "note": "flip 0's at indices 5 and 10"
              },
              {
                "input": "[]int{0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1}, 3",
                "output": "10"
              }
            ],
            "solution": "func longestOnes(nums []int, k int) int {\n    left := 0\n    zeros := 0\n    maxLen := 0\n    \n    for right := 0; right < len(nums); right++ {\n        if nums[right] == 0 {\n            zeros++\n        }\n        \n        for zeros > k {\n            if nums[left] == 0 {\n                zeros--\n            }\n            left++\n        }\n        \n        if right - left + 1 > maxLen {\n            maxLen = right - left + 1\n        }\n    }\n    return maxLen\n}",
            "solutionNotes": "Variable window: expand right, count zeros. When zeros > k, shrink from left. Track maximum valid window size."
          }
        ]
      },
      {
        "id": "advanced_7",
        "difficulty": 5,
        "baseTitle": "Track Min/Max While Scanning",
        "concept": "Best So Far Pattern",
        "variants": [
          {
            "id": "v1",
            "title": "Best Time to Buy and Sell Stock",
            "description": "Given an array of stock prices where prices[i] is the price on day i, find the maximum profit from one buy and one sell. You must buy before you sell. <code>func maxProfit(prices []int) int</code>",
            "functionSignature": "func maxProfit(prices []int) int",
            "testCases": [
              {
                "input": "[]int{7, 1, 5, 3, 6, 4}",
                "output": "5",
                "note": "buy at 1, sell at 6"
              },
              {
                "input": "[]int{7, 6, 4, 3, 1}",
                "output": "0",
                "note": "prices only go down, no profit possible"
              },
              {
                "input": "[]int{2, 4, 1}",
                "output": "2",
                "note": "buy at 2, sell at 4"
              }
            ],
            "solution": "func maxProfit(prices []int) int {\n    if len(prices) == 0 {\n        return 0\n    }\n    \n    minPrice := prices[0]\n    maxProfit := 0\n    \n    for _, price := range prices {\n        if price < minPrice {\n            minPrice = price\n        } else if price - minPrice > maxProfit {\n            maxProfit = price - minPrice\n        }\n    }\n    return maxProfit\n}"
          },
          {
            "id": "v2",
            "title": "Maximum Difference",
            "description": "Find the maximum difference between any two elements where the larger element comes after the smaller one. Return 0 if no such pair exists. <code>func maxDiff(nums []int) int</code>",
            "functionSignature": "func maxDiff(nums []int) int",
            "testCases": [
              {
                "input": "[]int{2, 3, 10, 6, 4, 8, 1}",
                "output": "8",
                "note": "10 - 2 = 8"
              },
              {
                "input": "[]int{7, 9, 5, 6, 3, 2}",
                "output": "2",
                "note": "9 - 7 = 2"
              },
              {
                "input": "[]int{5, 4, 3, 2, 1}",
                "output": "0",
                "note": "decreasing, no valid pair"
              }
            ],
            "solution": "func maxDiff(nums []int) int {\n    if len(nums) < 2 {\n        return 0\n    }\n    \n    minSoFar := nums[0]\n    maxDiff := 0\n    \n    for i := 1; i < len(nums); i++ {\n        diff := nums[i] - minSoFar\n        if diff > maxDiff {\n            maxDiff = diff\n        }\n        if nums[i] < minSoFar {\n            minSoFar = nums[i]\n        }\n    }\n    return maxDiff\n}",
            "solutionNotes": "This is the same problem as Best Time to Buy/Sell Stock! Track the minimum seen so far, and at each position calculate the potential profit/difference."
          },
          {
            "id": "v3",
            "title": "Best Sightseeing Pair",
            "description": "Given an array of values, find max score of values[i] + values[j] + i - j where i < j. <code>func maxScoreSightseeingPair(values []int) int</code>",
            "functionSignature": "func maxScoreSightseeingPair(values []int) int",
            "testCases": [
              {
                "input": "[]int{8, 1, 5, 2, 6}",
                "output": "11",
                "note": "i=0, j=2: 8+5+0-2=11"
              },
              {
                "input": "[]int{1, 2}",
                "output": "2",
                "note": "1+2+0-1=2"
              },
              {
                "input": "[]int{1, 3, 5}",
                "output": "7",
                "note": "i=1, j=2: 3+5+1-2=7"
              }
            ],
            "solution": "func maxScoreSightseeingPair(values []int) int {\n    maxScore := 0\n    bestI := values[0] + 0  // values[i] + i\n    \n    for j := 1; j < len(values); j++ {\n        score := bestI + values[j] - j\n        if score > maxScore {\n            maxScore = score\n        }\n        if values[j] + j > bestI {\n            bestI = values[j] + j\n        }\n    }\n    return maxScore\n}",
            "solutionNotes": "Rewrite the formula: (values[i] + i) + (values[j] - j). Track the best (values[i] + i) seen so far, then for each j compute the score. Same pattern as stock problem!"
          },
          {
            "id": "v4",
            "title": "Maximum Subarray (Kadane's)",
            "description": "Find the contiguous subarray with the largest sum. <code>func maxSubArray(nums []int) int</code>",
            "functionSignature": "func maxSubArray(nums []int) int",
            "testCases": [
              {
                "input": "[]int{-2, 1, -3, 4, -1, 2, 1, -5, 4}",
                "output": "6",
                "note": "[4,-1,2,1] = 6"
              },
              {
                "input": "[]int{1}",
                "output": "1"
              },
              {
                "input": "[]int{-1, -2, -3}",
                "output": "-1",
                "note": "least negative"
              }
            ],
            "solution": "func maxSubArray(nums []int) int {\n    maxSum := nums[0]\n    currentSum := nums[0]\n    \n    for i := 1; i < len(nums); i++ {\n        if currentSum < 0 {\n            currentSum = nums[i]\n        } else {\n            currentSum += nums[i]\n        }\n        if currentSum > maxSum {\n            maxSum = currentSum\n        }\n    }\n    return maxSum\n}",
            "solutionNotes": "Kadane's algorithm: at each position, decide whether to extend the current subarray or start fresh. Track the best sum seen so far. Same 'best so far' pattern!"
          },
          {
            "id": "v5",
            "title": "Best Time to Buy and Sell Stock II",
            "description": "You can buy and sell multiple times (but must sell before buying again). Find the maximum total profit. <code>func maxProfitII(prices []int) int</code>",
            "functionSignature": "func maxProfitII(prices []int) int",
            "testCases": [
              {
                "input": "[]int{7, 1, 5, 3, 6, 4}",
                "output": "7",
                "note": "buy@1 sell@5 (+4), buy@3 sell@6 (+3)"
              },
              {
                "input": "[]int{1, 2, 3, 4, 5}",
                "output": "4",
                "note": "buy@1 sell@5, or buy/sell each day"
              },
              {
                "input": "[]int{7, 6, 4, 3, 1}",
                "output": "0",
                "note": "no profit possible"
              }
            ],
            "solution": "func maxProfitII(prices []int) int {\n    profit := 0\n    \n    for i := 1; i < len(prices); i++ {\n        if prices[i] > prices[i-1] {\n            profit += prices[i] - prices[i-1]\n        }\n    }\n    return profit\n}",
            "solutionNotes": "Greedy insight: capture every upward movement! If tomorrow's price is higher, that's profit. Sum all positive differences. Much simpler than it seems!"
          },
          {
            "id": "v6",
            "title": "Trapping Rain Water",
            "description": "Given an elevation map where width of each bar is 1, compute how much water can be trapped after raining. <code>func trap(height []int) int</code>",
            "functionSignature": "func trap(height []int) int",
            "testCases": [
              {
                "input": "[]int{0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1}",
                "output": "6"
              },
              {
                "input": "[]int{4, 2, 0, 3, 2, 5}",
                "output": "9"
              },
              {
                "input": "[]int{1, 2, 3}",
                "output": "0",
                "note": "strictly increasing, no trapping"
              }
            ],
            "solution": "func trap(height []int) int {\n    if len(height) == 0 {\n        return 0\n    }\n    \n    n := len(height)\n    maxLeft := make([]int, n)\n    maxRight := make([]int, n)\n    \n    maxLeft[0] = height[0]\n    for i := 1; i < n; i++ {\n        if height[i] > maxLeft[i-1] {\n            maxLeft[i] = height[i]\n        } else {\n            maxLeft[i] = maxLeft[i-1]\n        }\n    }\n    \n    maxRight[n-1] = height[n-1]\n    for i := n - 2; i >= 0; i-- {\n        if height[i] > maxRight[i+1] {\n            maxRight[i] = height[i]\n        } else {\n            maxRight[i] = maxRight[i+1]\n        }\n    }\n    \n    water := 0\n    for i := 0; i < n; i++ {\n        level := maxLeft[i]\n        if maxRight[i] < level {\n            level = maxRight[i]\n        }\n        water += level - height[i]\n    }\n    return water\n}",
            "solutionNotes": "At each position, water level = min(maxLeft, maxRight). Pre-compute maxLeft[i] and maxRight[i] arrays using the 'best so far' pattern in both directions!"
          }
        ]
      }
    ],
    "preExercises": {
      "advanced_1": {
        "title": "Pre-exercise: Map as a Set",
        "description": "Before tackling the algorithm, let's practice the core pattern: using a map to track what you've seen.",
        "exercises": [
          {
            "id": "pre1",
            "title": "Track Visited Pages",
            "problem": "You're building a browser history tracker. Write code that creates a <code>map[string]bool</code> called <code>visited</code>, marks three pages as visited, then checks if \"google.com\" has been visited.",
            "hints": [
              {
                "title": "Creating the map",
                "content": "Create with: <code>visited := make(map[string]bool)</code><br>This creates an empty map where keys are strings and values are booleans."
              },
              {
                "title": "Marking as visited",
                "content": "To mark a page as visited: <code>visited[\"google.com\"] = true</code><br>Do this for three different pages."
              },
              {
                "title": "Checking if visited",
                "content": "The simple way: <code>if visited[\"google.com\"]</code><br>This works because if the key doesn't exist, Go returns <code>false</code> (the zero value for bool)!"
              }
            ],
            "solution": "visited := make(map[string]bool)\n\n// Mark pages as visited\nvisited[\"google.com\"] = true\nvisited[\"github.com\"] = true\nvisited[\"go.dev\"] = true\n\n// Check if google.com was visited\nif visited[\"google.com\"] {\n    fmt.Println(\"You've been to google.com\")\n}\n\n// Check something NOT visited\nif visited[\"facebook.com\"] {\n    fmt.Println(\"You've been to facebook.com\")\n} else {\n    fmt.Println(\"Never visited facebook.com\")\n}",
            "expectedOutput": "You've been to google.com\nNever visited facebook.com",
            "keyInsight": "When you access a key that doesn't exist in a <code>map[T]bool</code>, Go returns <code>false</code>. This makes <code>if visited[key]</code> a clean way to check membership - no need for the comma-ok pattern here!"
          },
          {
            "id": "pre2",
            "title": "Unique Letter Collector",
            "problem": "Write code that loops through the string \"banana\" and collects each unique letter into a <code>map[rune]bool</code>. Print how many unique letters there are.",
            "hints": [
              {
                "title": "Setup",
                "content": "Create the map: <code>letters := make(map[rune]bool)</code><br>Loop with: <code>for _, char := range \"banana\"</code>"
              },
              {
                "title": "Collecting",
                "content": "For each character, just mark it as seen: <code>letters[char] = true</code><br>Maps automatically handle duplicates - setting the same key twice just overwrites."
              },
              {
                "title": "Counting",
                "content": "The number of unique letters is: <code>len(letters)</code>"
              }
            ],
            "solution": "letters := make(map[rune]bool)\n\nfor _, char := range \"banana\" {\n    letters[char] = true\n}\n\nfmt.Printf(\"Unique letters: %d\\n\", len(letters))  // 3: b, a, n",
            "expectedOutput": "Unique letters: 3",
            "keyInsight": "A map automatically handles duplicates - you can set the same key multiple times and it just overwrites. This is why <code>len(map)</code> gives you the count of unique keys!"
          }
        ]
      },
      "advanced_2": {
        "title": "Pre-exercise: Slow/Fast Pointer Prep",
        "description": "Before the in-place algorithm, let's practice the core logic of detecting duplicates in sorted arrays.",
        "exercises": [
          {
            "id": "pre2a",
            "title": "Copy Unique to New Slice",
            "problem": "Given the sorted slice <code>[]int{1, 1, 2, 2, 3}</code>, create a NEW slice containing only the unique values <code>[1, 2, 3]</code>. Don't modify the original - just build a new one with <code>append</code>.",
            "hints": [
              {
                "title": "Step 1: Setup",
                "content": "<pre>nums := []int{1, 1, 2, 2, 3}\nresult := []int{nums[0]}  // First element is always unique</pre>"
              },
              {
                "title": "Step 2: Loop starting from index 1",
                "content": "<pre>for i := 1; i < len(nums); i++ {\n    // Compare current with previous\n}</pre>"
              },
              {
                "title": "Step 3: Append when different",
                "content": "<pre>if nums[i] != nums[i-1] {\n    result = append(result, nums[i])\n}</pre>"
              }
            ],
            "solution": "nums := []int{1, 1, 2, 2, 3}\nresult := []int{nums[0]}  // First element always unique\n\nfor i := 1; i < len(nums); i++ {\n    if nums[i] != nums[i-1] {\n        result = append(result, nums[i])\n    }\n}\n\nfmt.Println(result)  // [1 2 3]",
            "expectedOutput": "[1 2 3]",
            "keyInsight": "In a sorted array, duplicates are always adjacent! So we only need to compare each element with the one before it. This same logic powers the in-place algorithm - we'll just write to the array instead of appending."
          },
          {
            "id": "pre2b",
            "title": "Count Consecutive Groups",
            "problem": "Given the sorted slice <code>[]int{1, 1, 2, 2, 2, 3}</code>, count how many distinct groups there are. Answer: 3 (the 1s, the 2s, and the 3).",
            "hints": [
              {
                "title": "Step 1: Initialize counter",
                "content": "<pre>nums := []int{1, 1, 2, 2, 2, 3}\ngroups := 1  // First element starts the first group</pre>"
              },
              {
                "title": "Step 2: Loop and count transitions",
                "content": "<pre>for i := 1; i < len(nums); i++ {\n    if nums[i] != nums[i-1] {\n        groups++  // New value = new group\n    }\n}</pre>"
              }
            ],
            "solution": "nums := []int{1, 1, 2, 2, 2, 3}\ngroups := 1  // First element starts the first group\n\nfor i := 1; i < len(nums); i++ {\n    if nums[i] != nums[i-1] {\n        groups++  // New value = new group\n    }\n}\n\nfmt.Printf(\"Groups: %d\\n\", groups)",
            "expectedOutput": "Groups: 3",
            "keyInsight": "This is exactly what the slow/fast algorithm returns! The slow pointer ends up at the last unique position, so slow+1 = number of unique elements = number of groups."
          }
        ]
      },
      "advanced_3": {
        "title": "Pre-exercise: Strings vs Runes",
        "description": "Before manipulating strings character-by-character, let's understand the difference between bytes and runes in Go.",
        "exercises": [
          {
            "id": "pre3a",
            "title": "Explore String Length vs Rune Count",
            "problem": "Compare the byte length and rune count of these strings: <code>\"hello\"</code>, <code>\"世界\"</code>, and <code>\"🎉\"</code>. Print both <code>len(s)</code> and <code>len([]rune(s))</code> for each.",
            "hints": [
              {
                "title": "Step 1: ASCII string",
                "content": "<pre>s1 := \"hello\"\nfmt.Printf(\"%s: %d bytes, %d runes\\n\", s1, len(s1), len([]rune(s1)))</pre>"
              },
              {
                "title": "Step 2: Chinese characters",
                "content": "<pre>s2 := \"世界\"\nfmt.Printf(\"%s: %d bytes, %d runes\\n\", s2, len(s2), len([]rune(s2)))</pre>"
              },
              {
                "title": "Step 3: Emoji",
                "content": "<pre>s3 := \"🎉\"\nfmt.Printf(\"%s: %d bytes, %d runes\\n\", s3, len(s3), len([]rune(s3)))</pre>"
              }
            ],
            "solution": "s1 := \"hello\"\nfmt.Printf(\"%s: %d bytes, %d runes\\n\", s1, len(s1), len([]rune(s1)))\n\ns2 := \"世界\"\nfmt.Printf(\"%s: %d bytes, %d runes\\n\", s2, len(s2), len([]rune(s2)))\n\ns3 := \"🎉\"\nfmt.Printf(\"%s: %d bytes, %d runes\\n\", s3, len(s3), len([]rune(s3)))",
            "expectedOutput": "hello: 5 bytes, 5 runes\n世界: 6 bytes, 2 runes\n🎉: 4 bytes, 1 runes",
            "keyInsight": "ASCII characters are 1 byte each, but Unicode characters can be 2-4 bytes! <code>len(string)</code> counts bytes, <code>len([]rune(string))</code> counts actual characters. Always convert to <code>[]rune</code> when you need to work with individual characters."
          },
          {
            "id": "pre3b",
            "title": "Convert, Modify, Convert Back",
            "problem": "Take the string <code>\"Go!\"</code>, convert to runes, change the first character to <code>'g'</code>, and convert back to a string. Print the result.",
            "hints": [
              {
                "title": "Step 1: Convert to runes",
                "content": "<pre>s := \"Go!\"\nrunes := []rune(s)</pre>"
              },
              {
                "title": "Step 2: Modify",
                "content": "<pre>runes[0] = 'g'  // Single quotes for rune literal</pre>"
              },
              {
                "title": "Step 3: Convert back",
                "content": "<pre>result := string(runes)\nfmt.Println(result)</pre>"
              }
            ],
            "solution": "s := \"Go!\"\nrunes := []rune(s)\n\nrunes[0] = 'g'  // Modify first character\n\nresult := string(runes)\nfmt.Println(result)",
            "expectedOutput": "go!",
            "keyInsight": "Strings in Go are immutable - you can't do <code>s[0] = 'g'</code>. The pattern is: convert to <code>[]rune</code>, modify the slice, convert back to <code>string</code>. This is exactly what we'll do for reversing strings!"
          }
        ]
      },
      "advanced_4": {
        "title": "Pre-exercise: Map Counting Prep",
        "description": "Before counting words, let's practice the building blocks: splitting strings and incrementing map values.",
        "exercises": [
          {
            "id": "pre4a",
            "title": "Explore strings.Fields",
            "problem": "Use <code>strings.Fields</code> to split the string <code>\"hello world go\"</code> into words and print each word on its own line.",
            "hints": [
              {
                "title": "Step 1: Import and split",
                "content": "<pre>import \"strings\"\n\nwords := strings.Fields(\"hello world go\")</pre>"
              },
              {
                "title": "Step 2: Loop and print",
                "content": "<pre>for _, word := range words {\n    fmt.Println(word)\n}</pre>"
              }
            ],
            "solution": "import \"strings\"\n\nwords := strings.Fields(\"hello world go\")\nfor _, word := range words {\n    fmt.Println(word)\n}",
            "expectedOutput": "hello\nworld\ngo",
            "keyInsight": "<code>strings.Fields</code> splits on any whitespace (spaces, tabs, newlines) and returns a <code>[]string</code>. It's smarter than <code>strings.Split(s, \" \")</code> because it handles multiple spaces correctly."
          },
          {
            "id": "pre4b",
            "title": "Count Letters (Simpler)",
            "problem": "Count how many times each letter appears in <code>\"hello\"</code>. Store in a <code>map[rune]int</code> and print the counts.",
            "hints": [
              {
                "title": "Step 1: Create the map",
                "content": "<pre>counts := make(map[rune]int)</pre>"
              },
              {
                "title": "Step 2: Loop through string",
                "content": "<pre>for _, char := range \"hello\" {\n    counts[char]++\n}</pre>"
              },
              {
                "title": "Step 3: Print results",
                "content": "<pre>for char, count := range counts {\n    fmt.Printf(\"%c: %d\\n\", char, count)\n}</pre>"
              }
            ],
            "solution": "counts := make(map[rune]int)\n\nfor _, char := range \"hello\" {\n    counts[char]++\n}\n\nfor char, count := range counts {\n    fmt.Printf(\"%c: %d\\n\", char, count)\n}",
            "expectedOutput": "h: 1\ne: 1\nl: 2\no: 1",
            "keyInsight": "The <code>++</code> operator works on map values! When the key doesn't exist, Go returns 0 (the zero value for int), then increments to 1. So <code>counts[char]++</code> handles both first-time and repeat cases."
          }
        ]
      },
      "advanced_5": {
        "title": "Pre-exercise: Two Sum Building Blocks",
        "description": "Before the full algorithm, let's practice the two key operations: looking up complements and building index maps.",
        "exercises": [
          {
            "id": "pre5a",
            "title": "Find Complement in Map",
            "problem": "Given this pre-built map <code>map[int]int{2: 0, 7: 1, 11: 2}</code> (value to index), target=9, and current number=7: calculate the complement and check if it exists in the map. Print the result.",
            "hints": [
              {
                "title": "Step 1: Setup",
                "content": "<pre>seen := map[int]int{2: 0, 7: 1, 11: 2}\ntarget := 9\nnum := 7</pre>"
              },
              {
                "title": "Step 2: Calculate complement",
                "content": "<pre>complement := target - num  // 9 - 7 = 2</pre>"
              },
              {
                "title": "Step 3: Check map with comma-ok",
                "content": "<pre>if idx, ok := seen[complement]; ok {\n    fmt.Printf(\"Found! %d is at index %d\\n\", complement, idx)\n}</pre>"
              }
            ],
            "solution": "seen := map[int]int{2: 0, 7: 1, 11: 2}\ntarget := 9\nnum := 7\n\ncomplement := target - num  // 9 - 7 = 2\n\nif idx, ok := seen[complement]; ok {\n    fmt.Printf(\"Found %d at index %d\\n\", complement, idx)\n} else {\n    fmt.Println(\"Not found\")\n}",
            "expectedOutput": "Found 2 at index 0",
            "keyInsight": "The complement is <code>target - current</code>. If we're looking for two numbers that sum to 9, and we have 7, we need to find 2. The map tells us WHERE we saw the 2 (at index 0)."
          },
          {
            "id": "pre5b",
            "title": "Build Value-to-Index Map",
            "problem": "Given <code>[]int{2, 7, 11}</code>, build a map that maps each value to its index: <code>map[int]int{2: 0, 7: 1, 11: 2}</code>.",
            "hints": [
              {
                "title": "Step 1: Create empty map",
                "content": "<pre>nums := []int{2, 7, 11}\nvalueToIndex := make(map[int]int)</pre>"
              },
              {
                "title": "Step 2: Loop with index",
                "content": "<pre>for i, num := range nums {\n    valueToIndex[num] = i\n}</pre>"
              }
            ],
            "solution": "nums := []int{2, 7, 11}\nvalueToIndex := make(map[int]int)\n\nfor i, num := range nums {\n    valueToIndex[num] = i\n}\n\nfmt.Println(valueToIndex)",
            "expectedOutput": "map[2:0 7:1 11:2]",
            "keyInsight": "The Two Sum algorithm builds this map AS it loops - checking for the complement first, then adding the current number. This ensures we don't match a number with itself!"
          }
        ]
      },
      "advanced_6": {
        "title": "Pre-exercise: Sliding Window Fundamentals",
        "description": "Before tackling sliding window problems, let's practice the core mechanics: managing a window and efficiently updating its state.",
        "exercises": [
          {
            "id": "pre6a",
            "title": "Fixed Window Sum",
            "problem": "Given <code>[]int{1, 2, 3, 4, 5}</code> and window size k=3, calculate the sum of the first window [1,2,3], then slide it one position and calculate the new sum [2,3,4] WITHOUT re-summing all elements.",
            "hints": [
              {
                "title": "Step 1: Calculate first window sum",
                "content": "<pre>nums := []int{1, 2, 3, 4, 5}\nk := 3\n\n// Sum first k elements\nwindowSum := 0\nfor i := 0; i < k; i++ {\n    windowSum += nums[i]\n}\nfmt.Println(windowSum)  // 6</pre>"
              },
              {
                "title": "Step 2: Slide the window",
                "content": "<pre>// The trick: add new element, subtract old element\n// New element is at index k (which is 3)\n// Old element is at index 0\nwindowSum = windowSum + nums[k] - nums[0]</pre>"
              },
              {
                "title": "Step 3: General formula",
                "content": "When sliding from position i-1 to i:<pre>windowSum = windowSum + nums[i+k-1] - nums[i-1]</pre>Or equivalently, when the right edge moves to index i:<pre>windowSum = windowSum + nums[i] - nums[i-k]</pre>"
              }
            ],
            "solution": "nums := []int{1, 2, 3, 4, 5}\nk := 3\n\n// Sum first window\nwindowSum := 0\nfor i := 0; i < k; i++ {\n    windowSum += nums[i]\n}\nfmt.Printf(\"Window [0:3] sum: %d\\n\", windowSum)  // 6\n\n// Slide window: add nums[3], remove nums[0]\nwindowSum = windowSum + nums[3] - nums[0]\nfmt.Printf(\"Window [1:4] sum: %d\\n\", windowSum)  // 9\n\n// Slide again: add nums[4], remove nums[1]\nwindowSum = windowSum + nums[4] - nums[1]\nfmt.Printf(\"Window [2:5] sum: %d\\n\", windowSum)  // 12",
            "expectedOutput": "Window [0:3] sum: 6\nWindow [1:4] sum: 9\nWindow [2:5] sum: 12",
            "keyInsight": "The sliding window trick: instead of recalculating the entire sum (O(k)), just add the new element and subtract the leaving element (O(1)). This makes processing all windows O(n) instead of O(n*k)!"
          },
          {
            "id": "pre6b",
            "title": "Variable Window with Map",
            "problem": "Track characters in a variable-size window. Given string \"abca\", add characters one by one to a <code>map[byte]int</code> (tracking counts), then simulate shrinking by decrementing counts.",
            "hints": [
              {
                "title": "Step 1: Setup and expand",
                "content": "<pre>s := \"abca\"\nseen := make(map[byte]int)\n\n// Add each character (expanding window)\nfor i := 0; i < len(s); i++ {\n    seen[s[i]]++\n    fmt.Printf(\"Added %c, counts: %v\\n\", s[i], seen)\n}</pre>"
              },
              {
                "title": "Step 2: Shrink from left",
                "content": "<pre>// Remove the first character (shrink)\nseen[s[0]]--\nif seen[s[0]] == 0 {\n    delete(seen, s[0])  // Clean up zero counts\n}\nfmt.Printf(\"After removing %c: %v\\n\", s[0], seen)</pre>"
              }
            ],
            "solution": "s := \"abca\"\nseen := make(map[byte]int)\n\n// Expand: add all characters\nfor i := 0; i < len(s); i++ {\n    seen[s[i]]++\n}\nfmt.Printf(\"Full window: %v\\n\", seen)  // a:2, b:1, c:1\n\n// Shrink: remove from left (index 0 = 'a')\nseen[s[0]]--\nif seen[s[0]] == 0 {\n    delete(seen, s[0])\n}\nfmt.Printf(\"After removing s[0]: %v\\n\", seen)  // a:1, b:1, c:1\n\n// Shrink more: remove s[1] = 'b'\nseen[s[1]]--\nif seen[s[1]] == 0 {\n    delete(seen, s[1])\n}\nfmt.Printf(\"After removing s[1]: %v\\n\", seen)  // a:1, c:1",
            "expectedOutput": "Full window: map[97:2 98:1 99:1]\nAfter removing s[0]: map[97:1 98:1 99:1]\nAfter removing s[1]: map[97:1 99:1]",
            "keyInsight": "Variable sliding windows use a map to track what's in the window. When expanding (right pointer moves), increment counts. When shrinking (left pointer moves), decrement counts. Delete keys when count hits 0 to keep the map clean."
          }
        ]
      },
      "advanced_7": {
        "title": "Pre-exercise: Tracking Best So Far",
        "description": "Before tackling optimization problems, let's practice the core pattern: tracking a running minimum/maximum while scanning.",
        "exercises": [
          {
            "id": "pre7a",
            "title": "Track Running Minimum",
            "problem": "Given <code>[]int{5, 3, 8, 1, 9, 2}</code>, print the running minimum after each element. Output should show: 5, 3, 3, 1, 1, 1.",
            "hints": [
              {
                "title": "Step 1: Initialize",
                "content": "<pre>nums := []int{5, 3, 8, 1, 9, 2}\nminSoFar := nums[0]\nfmt.Println(minSoFar)  // First element is the min so far</pre>"
              },
              {
                "title": "Step 2: Loop and update",
                "content": "<pre>for i := 1; i < len(nums); i++ {\n    if nums[i] < minSoFar {\n        minSoFar = nums[i]\n    }\n    fmt.Println(minSoFar)\n}</pre>"
              }
            ],
            "solution": "nums := []int{5, 3, 8, 1, 9, 2}\nminSoFar := nums[0]\nfmt.Println(minSoFar)\n\nfor i := 1; i < len(nums); i++ {\n    if nums[i] < minSoFar {\n        minSoFar = nums[i]\n    }\n    fmt.Println(minSoFar)\n}",
            "expectedOutput": "5\n3\n3\n1\n1\n1",
            "keyInsight": "At each position, <code>minSoFar</code> holds the smallest value we've seen from the start up to that point. This is the foundation of the 'Best So Far' pattern - we don't need to remember ALL previous values, just the one that matters!"
          },
          {
            "id": "pre7b",
            "title": "Calculate Difference from Minimum",
            "problem": "Given <code>[]int{5, 3, 8, 1, 9}</code>, for each element print the difference between it and the minimum of all PREVIOUS elements. Skip the first element (no previous elements). Output: -2, 5, -2, 8.",
            "hints": [
              {
                "title": "Step 1: Initialize",
                "content": "<pre>nums := []int{5, 3, 8, 1, 9}\nminSoFar := nums[0]  // Min of elements before current</pre>"
              },
              {
                "title": "Step 2: Loop from second element",
                "content": "<pre>for i := 1; i < len(nums); i++ {\n    diff := nums[i] - minSoFar\n    fmt.Println(diff)\n    // Update minSoFar AFTER calculating diff\n    if nums[i] < minSoFar {\n        minSoFar = nums[i]\n    }\n}</pre>"
              },
              {
                "title": "Key insight",
                "content": "The order matters! Calculate the difference BEFORE updating minSoFar. This ensures we're comparing to the minimum of previous elements, not including the current one."
              }
            ],
            "solution": "nums := []int{5, 3, 8, 1, 9}\nminSoFar := nums[0]\n\nfor i := 1; i < len(nums); i++ {\n    diff := nums[i] - minSoFar\n    fmt.Println(diff)\n    \n    // Update min AFTER calculating diff\n    if nums[i] < minSoFar {\n        minSoFar = nums[i]\n    }\n}",
            "expectedOutput": "-2\n5\n-2\n8",
            "keyInsight": "This is exactly the stock problem! The difference <code>nums[i] - minSoFar</code> is the profit if you bought at the minimum price so far and sold today. The maximum of all these differences is your answer. Notice we update minSoFar AFTER calculating the diff - order matters!"
          }
        ]
      }
    }
  }
};
