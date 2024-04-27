package com.example.olympiad.web.dto.contest.AddProblems;

import lombok.Data;

import java.util.List;
@Data
public class AddProblemsRequest {
    private Long session;
    List<String> problems;
}
